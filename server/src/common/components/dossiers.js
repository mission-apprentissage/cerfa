const { Workspace, Dossier, Cerfa, User } = require("../model/index");
const Boom = require("boom");
const Joi = require("joi");
const permissions = require("./permissions");
const { findIndex, find, countBy } = require("lodash");

const { DateTime } = require("luxon");
const { mongoose } = require("../../common/mongodb");

module.exports = async () => {
  const buildContributorsResult = async (contributeurEmail, workspaceId, dossierId, { users, permissions, roles }) => {
    // components avoid circular dependencies

    const userSelectFields = { email: 1, nom: 1, prenom: 1, _id: 0, roles: 1 };
    const roleSelectFields = { name: 1, description: 1, title: 1, _id: 1 };
    const permSelectFields = { addedAt: 1, role: 1, acl: 1 };

    const currentUser = (await users.getUser(contributeurEmail, userSelectFields)) || {
      email: contributeurEmail,
      nom: "",
      prenom: "",
    };

    const currentUserPerm = await permissions.hasPermission(
      { workspaceId, dossierId, userEmail: contributeurEmail },
      permSelectFields
    );
    if (!currentUserPerm) {
      throw Boom.badRequest("Something went wrong");
    }
    const currentUserRole = await roles.findRolePermissionById(currentUserPerm.role, roleSelectFields);
    if (!currentUserRole) {
      throw Boom.badRequest("Something went wrong");
    }
    const type = currentUser && currentUser.roles ? await roles.findRoleById(currentUser?.roles[0]) : null;

    return {
      user: { ...currentUser, type: type?.name || null },
      permission: {
        permId: currentUserPerm._id,
        addedAt: currentUserPerm.addedAt,
        customAcl: currentUserPerm.acl,
        ...currentUserRole,
      },
    };
  };

  return {
    createDossier: async (user, option = { nom: null, saved: false }, workspaceId = null) => {
      const userDb = await User.findOne({ email: user.sub });
      if (!userDb) {
        throw new Error("User doesn't exist");
      }

      const wks = await Workspace.findOne({ owner: userDb._id });
      if (!wks) {
        throw new Error("Something went wrong");
      }

      let result = null;

      try {
        result = await Dossier.create({
          nom:
            option.nom || `Dossier ${DateTime.now().setZone("Europe/Paris").setLocale("fr-FR").toFormat("DD à HH:mm")}`,
          draft: true,
          workspaceId: workspaceId || wks._id,
          owner: userDb._id,
          saved: option.saved,
        });
      } catch (error) {
        const { code, name, message } = error;
        if (name === "MongoError" && code === 11000 && message.includes("dossierId_1 dup key")) {
          throw Boom.conflict("Already exist");
        } else {
          throw new Error(error);
        }
      }

      const { createPermission } = await permissions();
      await createPermission({
        workspaceId: workspaceId || wks._id.toString(),
        dossierId: result._id.toString(),
        userEmail: userDb.email,
        role: "dossier.admin",
      });

      return result;
    },
    findDossierById: async (id, select = {}) => await Dossier.findById(id, select).lean(),
    findDossiers: async (query, select = {}) => await Dossier.find(query, select).lean(),
    saveDossier: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate(
        { _id: id },
        {
          saved: true,
          lastModified: Date.now(),
        },
        { new: true }
      );
    },
    updateDreetsDdets: async (id, dreets, ddets) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate(
        { _id: id },
        {
          dreets,
          ddets,
        },
        { new: true }
      );
    },
    initializeSignatairesDossier: async (id, cerfa, contributors) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      let signataires = {
        employeur: {
          firstname: contributors[0].user.prenom,
          lastname: contributors[0].user.nom,
          email: contributors[0].user.email,
          phone: cerfa.employeur.telephone,
          status: "EN_ATTENTE_SIGNATURE",
        },
        apprenti: {
          firstname: cerfa.apprenti.prenom,
          lastname: cerfa.apprenti.nom,
          email: cerfa.apprenti.courriel,
          phone: cerfa.apprenti.telephone,
          status: "EN_ATTENTE_SIGNATURE",
        },
        cfa: {
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          status: "EN_ATTENTE_SIGNATURE",
        },
        ...(cerfa.apprenti.apprentiMineurNonEmancipe
          ? {
              legal: {
                firstname: cerfa.apprenti.responsableLegal.nom,
                lastname: cerfa.apprenti.responsableLegal.prenom,
                email: "",
                phone: "",
                status: "EN_ATTENTE_SIGNATURE",
              },
            }
          : {}),
        complete: false,
      };

      const countContributorsType = countBy(contributors, (contributor) => contributor.user.type);

      if (countContributorsType.entreprise === 1) {
        const employeurContributors = find(contributors, (contributor) => contributor.user.type === "entreprise");
        signataires.employeur = {
          firstname: employeurContributors.user.prenom,
          lastname: employeurContributors.user.nom,
          email: employeurContributors.user.email,
          phone: employeurContributors.user.telephone,
          status: "EN_ATTENTE_SIGNATURE",
        };
      }

      if (countContributorsType.cfa === 1) {
        const cfaContributors = find(contributors, (contributor) => contributor.user.type === "cfa");
        signataires.cfa = {
          firstname: cfaContributors.user.prenom,
          lastname: cfaContributors.user.nom,
          email: cfaContributors.user.email,
          phone: cfaContributors.user.telephone,
          status: "EN_ATTENTE_SIGNATURE",
        };
      }

      return await Dossier.findOneAndUpdate(
        { _id: id },
        {
          signataires,
        },
        { new: true }
      );
    },
    updateSignatairesDossier: async (id, signataires) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      let tmpComplete = true;

      const lookupDuplicate = [];
      for (let key of Object.keys(signataires)) {
        const element = signataires[key];
        if (element.firstname === "" || element.lastname === "" || element.email === "") {
          tmpComplete = false;
          break;
        }

        if (lookupDuplicate.includes(element.email)) {
          tmpComplete = false;
          break;
        } else {
          lookupDuplicate.push(element.email);
        }
      }

      signataires.complete = tmpComplete;

      return await Dossier.findOneAndUpdate({ _id: id }, { signataires }, { new: true });
    },
    getDocuments: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return found.documents;
    },
    getDocument: async (dossierId, nomFichier, cheminFichier) => {
      const found = await Dossier.findById(dossierId).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      const foundDocument = find(found.documents, {
        nomFichier,
        cheminFichier,
      });
      if (!foundDocument) {
        throw Boom.notFound("Doesn't exist");
      }

      return foundDocument;
    },
    addDocument: async (id, data) => {
      const found = await Dossier.findById(id);

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      let { typeDocument, nomFichier, cheminFichier, tailleFichier, userEmail, hash } = await Joi.object({
        typeDocument: Joi.string()
          .valid(
            "CONVENTION_FORMATION",
            "CONVENTION_REDUCTION_DUREE",
            "CONVENTION_MOBILITE",
            "FACTURE",
            "CERTIFICAT_REALISATION",
            "CONTRAT"
          )
          .required(),
        // typeFichier: Joi.string().required(), // "pdf"
        nomFichier: Joi.string().required(),
        cheminFichier: Joi.string().required(),
        tailleFichier: Joi.number().required(),
        userEmail: Joi.string().required(),
        hash: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      const newDocument = {
        documentId: mongoose.Types.ObjectId(),
        typeDocument,
        typeFichier: "pdf",
        nomFichier,
        cheminFichier,
        tailleFichier,
        dateAjout: Date.now(),
        dateMiseAJour: Date.now(),
        quiMiseAJour: userEmail.toLowerCase(),
        hash,
      };

      let newDocuments = [...found._doc.documents];
      const foundIndexDocument = findIndex(newDocuments, {
        typeDocument: newDocument.typeDocument,
        nomFichier: newDocument.nomFichier,
        tailleFichier: newDocument.tailleFichier,
      });
      if (foundIndexDocument != -1) {
        newDocuments.splice(foundIndexDocument, 1);
      }
      newDocuments = [...newDocuments, newDocument];

      found._doc.documents = newDocuments;
      found._doc.lastModified = Date.now();

      return await found.save();
    },
    removeDocument: async (id, data) => {
      const found = await Dossier.findById(id);

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      let { typeDocument, nomFichier, cheminFichier, tailleFichier } = await Joi.object({
        typeDocument: Joi.string()
          .valid(
            "CONVENTION_FORMATION",
            "CONVENTION_REDUCTION_DUREE",
            "CONVENTION_MOBILITE",
            "FACTURE",
            "CERTIFICAT_REALISATION",
            "CONTRAT"
          )
          .required(),
        nomFichier: Joi.string().required(),
        cheminFichier: Joi.string().required(),
        tailleFichier: Joi.number().required(),
      }).validateAsync(data, { abortEarly: false });

      const lookupDocument = {
        typeDocument,
        nomFichier,
        cheminFichier,
        tailleFichier,
      };

      let newDocuments = [...found._doc.documents];
      const foundIndexDocument = findIndex(newDocuments, {
        typeDocument: lookupDocument.typeDocument,
        nomFichier: lookupDocument.nomFichier,
        cheminFichier: lookupDocument.cheminFichier,
        tailleFichier: lookupDocument.tailleFichier,
      });
      if (foundIndexDocument === -1) {
        throw new Error("Something went wrong");
      }

      newDocuments.splice(foundIndexDocument, 1);

      return await Dossier.findOneAndUpdate(
        { _id: id },
        {
          documents: newDocuments,
          lastModified: Date.now(),
        },
        { new: true }
      );
    },
    publishDossier: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate(
        { _id: id },
        { draft: false, etat: "DOSSIER_FINALISE_EN_ATTENTE_ACTION" },
        { new: true }
      );
    },
    unpublishDossier: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate(
        { _id: id },
        {
          draft: true,
          etat: "BROUILLON",
          mode: null,
        },
        { new: true }
      );
    },
    updateModeDossier: async (id, mode) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate({ _id: id }, { mode }, { new: true });
    },
    updateEtatDossier: async (id, etat) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate({ _id: id }, { etat }, { new: true });
    },
    updateSignatures: async (id, signatures) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate(
        { _id: id },
        {
          signatures,
        },
        { new: true }
      );
    },
    removeDossier: async (_id) => {
      const found = await Dossier.findById(_id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      const { findPermissions, removePermission } = await permissions();
      const perms = await findPermissions({ workspaceId: found.workspaceId, dossierId: found._id });
      for (let index = 0; index < perms.length; index++) {
        const perm = perms[index];
        await removePermission(perm._id);
      }

      // TODO remove documents as well !

      await Cerfa.deleteOne({ dossierId: found._id });

      return await Dossier.deleteOne({ _id });
    },
    addContributeur: async (dossierId, userEmail, as, acl = []) => {
      const dossierDb = await Dossier.findById(dossierId);
      if (!dossierDb) {
        throw new Error("wks doesn't exist");
      }

      const { createPermission } = await permissions();
      await createPermission({
        workspaceId: dossierDb.workspaceId.toString(),
        dossierId: dossierDb._id.toString(),
        userEmail: userEmail.toLowerCase(),
        role: as,
        acl,
      });

      dossierDb.contributeurs = [...dossierDb.contributeurs, userEmail.toLowerCase()];
      await dossierDb.save();
      return dossierDb.contributeurs;
    },
    getContributeurs: async (dossierId, components) => {
      // components avoid circular dependencies

      const dossier = await Dossier.findById(dossierId, { contributeurs: 1, owner: 1, workspaceId: 1 }).lean();
      if (!dossier) {
        throw Boom.notFound("Doesn't exist");
      }

      const ownerUser = await components.users.getUserById(dossier.owner, { email: 1 });
      if (!ownerUser) {
        throw Boom.badRequest("Something went wrong");
      }

      const owner = await buildContributorsResult(ownerUser.email, dossier.workspaceId, dossierId, components);
      const contributeurs = [];
      for (let index = 0; index < dossier.contributeurs.length; index++) {
        const contributeurEmail = dossier.contributeurs[index];
        const contributeur = await buildContributorsResult(
          contributeurEmail,
          dossier.workspaceId,
          dossierId,
          components
        );
        contributeurs.push(contributeur);
      }
      return [{ ...owner, owner: true }, ...contributeurs];
    },
    removeContributeur: async (dossierId, userEmail, permId) => {
      const dossierDb = await Dossier.findById(dossierId);
      if (!dossierDb) {
        throw new Error("wks doesn't exist");
      }

      const { removePermission } = await permissions();
      await removePermission(permId);

      dossierDb.contributeurs = dossierDb.contributeurs.filter(
        (contributeur) => contributeur !== userEmail.toLowerCase()
      );

      await dossierDb.save();
      return dossierDb.contributeurs;
    },
  };
};

const { Workspace, Dossier, Cerfa, User } = require("../model/index");
const Boom = require("boom");
const Joi = require("joi");
const permissions = require("./permissions");
const moment = require("moment");
const { findIndex, find } = require("lodash");
moment.locale("fr-FR");

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
    createDossier: async (user, option = { nom: null, saved: false }) => {
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
          nom: option.nom || `Dossier ${moment(new Date()).add(1, "hour").format("DD MMM YYYY à HH:mm")}`,
          draft: true,
          workspaceId: wks._id,
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
        workspaceId: wks._id.toString(),
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

      let { typeDocument, nomFichier, cheminFichier, tailleFichier, userEmail } = await Joi.object({
        typeDocument: Joi.string()
          .valid(
            "CONVENTION_FORMATION",
            "CONVENTION_REDUCTION_DUREE",
            "CONVENTION_MOBILITE",
            "FACTURE",
            "CERTIFICAT_REALISATION"
          )
          .required(),
        // typeFichier: Joi.string().required(), // "pdf"
        nomFichier: Joi.string().required(),
        cheminFichier: Joi.string().required(),
        tailleFichier: Joi.number().required(),
        userEmail: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      const newDocument = {
        typeDocument,
        typeFichier: "pdf",
        nomFichier,
        cheminFichier,
        tailleFichier,
        dateAjout: Date.now(),
        dateMiseAJour: Date.now(),
        quiMiseAJour: userEmail,
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
            "CERTIFICAT_REALISATION"
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

      return await Dossier.findOneAndUpdate({ _id: id }, { draft: false }, { new: true });
    },
    unpublishDossier: async (id) => {
      const found = await Dossier.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Dossier.findOneAndUpdate({ _id: id }, { draft: true }, { new: true });
    },
    removeDossier: async (_id) => {
      const found = await Dossier.findById(_id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

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
        userEmail,
        role: as,
        acl,
      });

      dossierDb.contributeurs = [...dossierDb.contributeurs, userEmail];
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

      dossierDb.contributeurs = dossierDb.contributeurs.filter((contributeur) => contributeur !== userEmail);

      await dossierDb.save();
      return dossierDb.contributeurs;
    },
  };
};

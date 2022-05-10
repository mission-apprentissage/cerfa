const { Cerfa } = require("../model/index");
const { mongoose } = require("../../common/mongodb");
const Joi = require("joi");
const Boom = require("boom");
const { set, get } = require("lodash");
const cerfaSchema = require("../model/schema/specific/dossier/cerfa/Cerfa");

const buildErrorResult = (validatedModel) => {
  let result = { reason: "" };
  if (validatedModel) {
    const keys = Object.keys(validatedModel.errors);
    for (let i = 0; i < keys.length; i++) {
      const err = validatedModel.errors[keys[i]];
      if (err.kind === "required") {
        set(result, `${err.path}`, { ...get(cerfaSchema, `${err.path}`), isErrored: true });
      } else if (err.kind === "enum") {
        set(result, `${err.path}`, { message: "Value not found in enum", isErrored: true });
      }
    }
  }
  if (result.apprenti?.apprentiMineurNonEmancipe) {
    result.reason = "Nous avons détecté un problème sur l'âge de l'apprenti(e)";
  }
  return validatedModel.errors;
};

module.exports = async () => {
  return {
    createCerfa: async (data) => {
      let { dossierId } = await Joi.object({
        dossierId: Joi.string().required(),
      }).validateAsync(data, { abortEarly: false });

      // TODO IF DOSSIER ID EXIST

      let result = null;
      try {
        result = await Cerfa.create({
          draft: true,
          dossierId,
        });
      } catch (error) {
        const { code, name, message } = error;
        if (name === "MongoError" && code === 11000 && message.includes("dossierId_1 dup key")) {
          throw Boom.conflict("Already exist");
        } else {
          throw new Error(error);
        }
      }
      return result;
    },
    findCerfaByDossierId: async (dossierId, select = {}) => await Cerfa.findOne({ dossierId }, select).lean(),
    publishCerfa: async (id) => {
      const found = await Cerfa.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      // eslint-disable-next-line no-unused-vars
      const { _id, __v, dossierId, ...cerfa } = found;
      let errorResult = null;
      try {
        const validate = await Cerfa.create({
          ...cerfa,
          // contrat: {
          //   ...cerfa.contrat,
          //   // dateConclusion: new Date(),
          // },
          employeur: {
            ...cerfa.employeur,
            libelleIdcc: undefined,
          },
          dossierId: mongoose.Types.ObjectId().toString(),
          draft: false,
        });
        await validate.delete();
      } catch (e) {
        errorResult = buildErrorResult(e, cerfa);
      }

      if (errorResult) {
        if (errorResult.apprenti?.apprentiMineurNonEmancipe) {
          if (cerfa.apprenti.age >= 18) {
            cerfa.apprenti.apprentiMineurNonEmancipe = false;
          } else {
            throw Boom.badData("Validation", errorResult);
          }
        } else {
          throw Boom.badData("Validation", errorResult);
        }
      }

      return await Cerfa.findOneAndUpdate(
        { _id: id },
        {
          ...cerfa,
          draft: false,
        },
        { new: true }
      );
    },
    unpublishCerfa: async (id) => {
      const found = await Cerfa.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Cerfa.findOneAndUpdate(
        { _id: id },
        {
          draft: true,

          // TODO: We keep it for now. After a migration we can remove this part.
          isLockedField: {
            employeur: {
              adresse: {
                numero: false,
                voie: false,
                complement: false,
                codePostal: false,
                commune: false,
                departement: false,
                region: false,
              },
              siret: false,
              denomination: false,
              raison_sociale: false,
              naf: false,
              nombreDeSalaries: false,
              codeIdcc: false,
              libelleIdcc: true,
              telephone: false,
              courriel: false,
              nom: false,
              prenom: false,
              typeEmployeur: false,
              employeurSpecifique: false,
              caisseComplementaire: false,
              regimeSpecifique: false,
              attestationEligibilite: false,
              attestationPieces: false,
              privePublic: true,
            },
            apprenti: {
              adresse: {
                numero: false,
                voie: false,
                complement: false,
                codePostal: false,
                commune: false,
              },
              responsableLegal: {
                adresse: {
                  numero: false,
                  voie: false,
                  complement: false,
                  codePostal: false,
                  commune: false,
                },
                nom: false,
                prenom: false,
              },
              nom: false,
              prenom: false,
              sexe: false,
              nationalite: false,
              dateNaissance: false,
              departementNaissance: false,
              communeNaissance: false,
              nir: true,
              regimeSocial: false,
              handicap: false,
              situationAvantContrat: false,
              diplome: false,
              derniereClasse: false,
              diplomePrepare: false,
              intituleDiplomePrepare: false,
              telephone: false,
              courriel: false,
              inscriptionSportifDeHautNiveau: false,
            },
            maitre1: {
              nom: false,
              prenom: false,
              dateNaissance: false,
            },
            maitre2: {
              nom: false,
              prenom: false,
              dateNaissance: false,
            },
            contrat: {
              modeContractuel: false,
              typeContratApp: false,
              numeroContratPrecedent: false,
              noContrat: false,
              noAvenant: false,
              dateDebutContrat: false,
              dateEffetAvenant: false,
              dateConclusion: false,
              dateFinContrat: false,
              dateRupture: false,
              lieuSignatureContrat: false,
              typeDerogation: false,
              dureeTravailHebdoHeures: false,
              dureeTravailHebdoMinutes: false,
              travailRisque: false,
              salaireEmbauche: false,
              caisseRetraiteComplementaire: false,
              avantageNature: false,
              avantageNourriture: false,
              avantageLogement: false,
              autreAvantageEnNature: false,
            },
            formation: {
              rncp: false,
              codeDiplome: false,
              typeDiplome: false,
              intituleQualification: false,
              dateDebutFormation: false,
              dateFinFormation: false,
              dureeFormation: false,
            },
            organismeFormation: {
              adresse: {
                numero: false,
                voie: false,
                complement: false,
                codePostal: false,
                commune: false,
              },
              siret: false,
              denomination: false,
              formationInterne: false,
              uaiCfa: false,
            },
            etablissementFormation: {
              adresse: {
                numero: false,
                voie: false,
                complement: false,
                codePostal: false,
                commune: false,
              },
              siret: false,
              denomination: false,
              uaiCfa: false,
            },
          },
        },
        { new: true }
      );
    },
    updateDossierId: async (_id, dossierId) => {
      let cerfa = await Cerfa.findById(_id);
      if (!cerfa) {
        throw new Error(`Unable to find cerfa ${_id}`);
      }

      if (!cerfa.draft) {
        throw new Error(`Cerfa ${_id} is not in draft mode`);
      }

      return await Cerfa.findOneAndUpdate({ _id }, { dossierId }, { new: true });
    },
    removeCerfa: async (_id) => {
      return await Cerfa.deleteOne({ _id });
    },
  };
};

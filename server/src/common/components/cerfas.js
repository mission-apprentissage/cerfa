const { Cerfa } = require("../model/index");
const { mongoose } = require("../../common/mongodb");
const Joi = require("joi");
const Boom = require("boom");

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
      const validate = await Cerfa.create({
        ...cerfa,
        contrat: {
          ...cerfa.contrat,
          dateConclusion: new Date(),
        },
        dossierId: mongoose.Types.ObjectId().toString(),
        draft: false,
      });
      await validate.delete();

      return await Cerfa.findOneAndUpdate(
        { _id: id },
        {
          draft: false,
          contrat: {
            ...cerfa.contrat,
            dateConclusion: new Date(),
          },
          isLockedField: {
            employeur: {
              adresse: {
                numero: true,
                voie: true,
                complement: true,
                codePostal: true,
                commune: true,
                departement: true,
                region: true,
              },
              siret: true,
              denomination: true,
              raison_sociale: true,
              naf: true,
              nombreDeSalaries: true,
              codeIdcc: true,
              libelleIdcc: true,
              telephone: true,
              courriel: true,
              nom: true,
              prenom: true,
              typeEmployeur: true,
              employeurSpecifique: true,
              caisseComplementaire: true,
              regimeSpecifique: true,
              attestationEligibilite: true,
              attestationPieces: true,
              privePublic: true,
            },
            apprenti: {
              adresse: {
                numero: true,
                voie: true,
                complement: true,
                codePostal: true,
                commune: true,
              },
              responsableLegal: {
                adresse: {
                  numero: true,
                  voie: true,
                  complement: true,
                  codePostal: true,
                  commune: true,
                },
                nom: true,
                prenom: true,
              },
              nom: true,
              prenom: true,
              sexe: true,
              nationalite: true,
              dateNaissance: true,
              departementNaissance: true,
              communeNaissance: true,
              nir: true,
              regimeSocial: true,
              handicap: true,
              situationAvantContrat: true,
              diplome: true,
              derniereClasse: true,
              diplomePrepare: true,
              intituleDiplomePrepare: true,
              telephone: true,
              courriel: true,
              inscriptionSportifDeHautNiveau: true,
            },
            maitre1: {
              nom: true,
              prenom: true,
              dateNaissance: true,
            },
            maitre2: {
              nom: true,
              prenom: true,
              dateNaissance: true,
            },
            contrat: {
              modeContractuel: true,
              typeContratApp: true,
              numeroContratPrecedent: true,
              noContrat: true,
              noAvenant: true,
              dateDebutContrat: true,
              dateEffetAvenant: true,
              dateConclusion: true,
              dateFinContrat: true,
              dateRupture: true,
              lieuSignatureContrat: true,
              typeDerogation: true,
              dureeTravailHebdoHeures: true,
              dureeTravailHebdoMinutes: true,
              travailRisque: true,
              salaireEmbauche: true,
              caisseRetraiteComplementaire: true,
              avantageNature: true,
              avantageNourriture: true,
              avantageLogement: true,
              autreAvantageEnNature: true,
            },
            formation: {
              rncp: true,
              codeDiplome: true,
              typeDiplome: true,
              intituleQualification: true,
              dateDebutFormation: true,
              dateFinFormation: true,
              dureeFormation: true,
            },
            organismeFormation: {
              adresse: {
                numero: true,
                voie: true,
                complement: true,
                codePostal: true,
                commune: true,
              },
              siret: true,
              denomination: true,
              formationInterne: true,
              uaiCfa: true,
            },
          },
        },
        { new: true }
      );
    },
    unpublishCerfa: async (id) => {
      const found = await Cerfa.findById(id).lean();

      if (!found) {
        throw Boom.notFound("Doesn't exist");
      }

      return await Cerfa.findOneAndUpdate({ _id: id }, { draft: true }, { new: true });
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

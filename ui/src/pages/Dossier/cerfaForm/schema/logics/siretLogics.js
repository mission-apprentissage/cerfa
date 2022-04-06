import { _post } from "../../../../../common/httpClient";

export const siretLogics = [
  {
    deps: ["employeur.siret"],
    process: async ({ values, signal, dossier }) => {
      const siret = values.employeur.siret;

      const { messages, result } = await fetchSiret({ siret, dossierId: dossier._id, signal });

      const resultLength = Object.keys(result).length;
      if (resultLength === 0) {
        return { error: messages.error };
      }

      if (result.api_entreprise === "KO") {
        return {
          warning: `Le service de récupération des informations Siret est momentanément indisponible. Nous ne pouvons pas pre-remplir le formulaire.`,
        };
      }

      if (result.ferme) {
        return { error: `Le Siret ${siret} est un établissement fermé.` };
      }

      if (result.secretSiret) {
        return {
          error: `Votre siret est valide. En revanche, en raison de sa nature, nous ne pouvons pas récupérer les informations reliées.`,
        };
      }

      return {
        cascade: {
          "employeur.denomination": { value: result.enseigne || result.entreprise_raison_sociale, locked: false },
          "employeur.naf": { value: result.naf_code, locked: false },
          "employeur.codeIdcc": {
            value: result.conventionCollective?.idcc ? `${result.conventionCollective?.idcc}` : "",
            locked: false,
          },
          "employeur.codeIdcc_special": {
            value: result.conventionCollective?.idcc ? `${result.conventionCollective?.idcc}` : "",
            locked: false,
          },
          "employeur.libelleIdcc": { value: result.conventionCollective?.titre || "" },
          "employeur.nombreDeSalaries": { value: result.entreprise_tranche_effectif_salarie?.de || "", locked: false },
          "employeur.adresse.numero": { value: result.numero_voie || "", locked: false },
          "employeur.adresse.voie": {
            value:
              result.type_voie || result.nom_voie
                ? `${result.type_voie ? `${result.type_voie} ` : ""}${result.nom_voie}`
                : "",
            locked: false,
          },
          "employeur.adresse.complement": { value: result.complement_adresse || "", locked: false },
          "employeur.adresse.codePostal": { value: result.code_postal || "", locked: false },
          "employeur.adresse.commune": { value: result.commune_implantation_nom || "", locked: false },
          "employeur.adresse.departement": { value: result.num_departement || "", locked: false },
          "employeur.adresse.region": { value: result.num_region || "", locked: true },
          "employeur.privePublic": { value: result.public ?? true, locked: false },
        },
      };
    },
  },
];

const fetchSiret = async ({ siret, dossierId, signal }) => {
  const { messages, result } = await _post(`/api/v1/siret`, { siret, dossierId }, signal);
  return { messages, result };
};

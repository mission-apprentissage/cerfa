import { apiService } from "../../services/api.service";

export const etablissementFormationSiretControl = [
  {
    deps: ["etablissementFormation.siret"],
    process: async ({ values, signal, dossier }) => {
      const siret = values.etablissementFormation.siret;
      const { messages, result } = await apiService.fetchSiret({ siret, dossierId: dossier._id, signal });

      const resultLength = Object.keys(result).length;
      if (resultLength === 0) return { error: messages.error };

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
          "etablissementFormation.denomination": {
            value: result.enseigne || result.entreprise_raison_sociale,
            locked: false,
          },
          "etablissementFormation.uaiCfa": {
            value: result.uai,
            locked: false,
          },
          "etablissementFormation.adresse.numero": {
            value: result.numero_voie || undefined,
            locked: false,
          },
          "etablissementFormation.adresse.voie": {
            value:
              result.type_voie || result.nom_voie
                ? `${result.type_voie ? `${result.type_voie} ` : undefined}${result.nom_voie}`
                : undefined,
            locked: false,
          },
          "etablissementFormation.adresse.complement": {
            value: result.complement_adresse || undefined,
            locked: false,
          },
          "etablissementFormation.adresse.codePostal": {
            value: result.code_postal || undefined,
            locked: false,
            cascade: false,
          },
          "etablissementFormation.adresse.commune": {
            value: result.commune_implantation_nom || undefined,
            locked: false,
          },
        },
      };
    },
  },
];

import { apiService } from "../../services/api.service";

export const siretOrganismeFormationLogic = {
  deps: ["organismeFormation.siret"],
  process: async ({ values, signal, dossier }) => {
    const siret = values.organismeFormation.siret;
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
        "organismeFormation.denomination": {
          value: result.enseigne || result.entreprise_raison_sociale,
          locked: false,
        },
        "organismeFormation.uaiCfa": { value: result.uai, locked: false },
        "organismeFormation.adresse.numero": { value: result.numero_voie || undefined, locked: false },
        "organismeFormation.adresse.voie": {
          value:
            result.type_voie || result.nom_voie
              ? `${result.type_voie ? `${result.type_voie} ` : undefined}${result.nom_voie}`
              : undefined,
          locked: false,
        },
        "organismeFormation.adresse.complement": { value: result.complement_adresse || undefined, locked: false },
        "organismeFormation.adresse.codePostal": {
          value: result.code_postal || undefined,
          locked: false,
          cascade: false,
        },
        "organismeFormation.adresse.commune": { value: result.commune_implantation_nom || undefined, locked: false },
      },
    };
  },
};

import { buildRemunerations2 } from "../../../../../common/utils/form/remunerationsUtils2";

export const RemunerationsLogics = [
  {
    deps: [
      "employeur.adresse.departement",
      "apprenti.dateNaissance",
      "contrat.dateDebutContrat",
      "contrat.dateFinContrat",
      "apprenti.age",
    ],
    process: ({ values }) => {
      const employeurAdresseDepartement = values.employeur.adresse.departement;
      const apprentiDateNaissance = values.apprenti.dateNaissance;
      const apprentiAge = values.apprenti.age;
      const dateDebutContrat = values.contrat.dateDebutContrat;
      const dateFinContrat = values.contrat.dateFinContrat;

      if (
        !apprentiDateNaissance ||
        !apprentiAge ||
        !dateDebutContrat ||
        !dateFinContrat ||
        !employeurAdresseDepartement
      ) {
        return;
      }

      const { remunerationsAnnuelles, smicObj } = buildRemunerations2({
        apprentiDateNaissance,
        apprentiAge,
        dateDebutContrat,
        dateFinContrat,
        employeurAdresseDepartement,
      });

      const oldRemus = values.contrat.remunerationsAnnuelles ?? [];
      const oldRemusCascade = Object.fromEntries(
        oldRemus?.flatMap((remu, i) => [
          [`contrat.remunerationsAnnuelles[${i}].dateDebut`, undefined],
          [`contrat.remunerationsAnnuelles[${i}].dateFin`, undefined],
          [`contrat.remunerationsAnnuelles[${i}].taux`, undefined],
          [`contrat.remunerationsAnnuelles[${i}].tauxMinimal`, undefined],
          [`contrat.remunerationsAnnuelles[${i}].typeSalaire`, undefined],
          [`contrat.remunerationsAnnuelles[${i}].salaireBrut`, undefined],
          [`contrat.remunerationsAnnuelles[${i}].ordre`, undefined],
        ])
      );

      const newRemus = Object.fromEntries(
        remunerationsAnnuelles?.flatMap((remu, i) => {
          return [
            [`contrat.remunerationsAnnuelles[${i}].dateDebut`, { value: remu.dateDebut }],
            [`contrat.remunerationsAnnuelles[${i}].dateFin`, { value: remu.dateFin }],
            [`contrat.remunerationsAnnuelles[${i}].taux`, { value: remu.taux }],
            [`contrat.remunerationsAnnuelles[${i}].tauxMinimal`, { value: remu.tauxMinimal }],
            [`contrat.remunerationsAnnuelles[${i}].typeSalaire`, { value: remu.typeSalaire }],
            [`contrat.remunerationsAnnuelles[${i}].salaireBrut`, { value: remu.salaireBrut }],
            [`contrat.remunerationsAnnuelles[${i}].ordre`, { value: remu.ordre }],
          ];
        })
      );

      return { cascade: { ...oldRemusCascade, ...newRemus, smic: smicObj } };
    },
  },
  ...new Array(20).fill(0).map((item, i) => {
    const remuAnneePath = `contrat.remunerationsAnnuelles[${i}]`;
    return {
      deps: [`${remuAnneePath}.taux`],
      process: ({ values }) => {
        const remunerationsAnnee = values.contrat.remunerationsAnnuelles[i];
        const employeurAdresseDepartement = values.employeur.adresse.departement;
        const apprentiDateNaissance = values.apprenti.dateNaissance;
        const apprentiAge = values.apprenti.age;
        const dateDebutContrat = values.contrat.dateDebutContrat;
        const dateFinContrat = values.contrat.dateFinContrat;

        console.log({
          apprentiDateNaissance,
          apprentiAge,
          dateDebutContrat,
          dateFinContrat,
          employeurAdresseDepartement,
          selectedTaux: { [remunerationsAnnee.ordre + ""]: remunerationsAnnee.taux },
        });
        const { remunerationsAnnuelles } = buildRemunerations2({
          apprentiDateNaissance,
          apprentiAge,
          dateDebutContrat,
          dateFinContrat,
          employeurAdresseDepartement,
          selectedTaux: { [remunerationsAnnee.ordre + ""]: remunerationsAnnee.taux },
        });

        return {
          cascade: {
            [`${remuAnneePath}.salaireBrut`]: {
              value: remunerationsAnnuelles[i].salaireBrut,
            },
          },
        };
      },
    };
  }),
  {
    deps: ["contrat.remunerationsAnnuelles[0].salaireBrut"],
    process: ({ values }) => {
      return {
        cascade: {
          "contrat.salaireEmbauche": { value: values.contrat.remunerationsAnnuelles[0].salaireBrut },
        },
      };
    },
  },
];

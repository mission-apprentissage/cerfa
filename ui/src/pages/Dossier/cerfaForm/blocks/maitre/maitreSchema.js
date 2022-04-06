export const maitreSchema = {
  "maitre1.nom": {
    required: true,
    label: "Nom de naissance:",
    requiredMessage: "le nom du maître d'apprentissage est obligatoire",
    example: "Dupont",
  },
  "maitre1.prenom": {
    required: true,
    label: "Prénom:",
    requiredMessage: "le prénom du maître d'apprentissage est obligatoire",
    example: "Claire",
  },
  "maitre1.dateNaissance": {
    required: true,
    fieldType: "date",
    description: "Le maître d'apprentissage doit être majeur à la date d'exécution du contrat.",
    label: "Date de naissance :",
    requiredMessage: "la date de naissance du maître d'apprentissage est obligatoire",
    example: "1988-02-02T00:00:00+0000",
  },
  "maitre2.nom": {
    label: "Nom de naissance:",
    requiredMessage: "le nom du maître d'apprentissage est obligatoire",
    example: "Dupont",
  },
  "maitre2.prenom": {
    label: "Prénom:",
    requiredMessage: "le prénom du maître d'apprentissage est obligatoire",
    example: "Claire",
  },
  "maitre2.dateNaissance": {
    fieldType: "date",
    description: "Le maître d'apprentissage doit être majeur à la date d'exécution du contrat.",
    label: "Date de naissance :",
    requiredMessage: "la date de naissance du maître d'apprentissage est obligatoire",
    example: "1988-02-02T00:00:00+0000",
  },
  "employeur.attestationEligibilite": {
    fieldType: "consent",
    label:
      "L'employeur atteste sur l'honneur que le(s) maître(s) d'apprentissage répond à l'ensemble des critères d'éligibilité à cette fonction.",
    required: true,
    description:
      "Le maître d'apprentissage doit notamment justifier d'une formation et d'une expérience professionnelle minimales (code du travail, [art. R6223-22](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037813428/)). Le changement de maître d'apprentissage en cours de contrat implique de conclure un avenant au contrat initial, sauf si le contrat initial indique un second maître d'apprentissage.",
    requiredMessage:
      "Il est obligatoire d'attester que le(s) maître(s) d'apprentissage répond à l'ensemble des critères d'éligibilité à cette fonction ",
  },
};

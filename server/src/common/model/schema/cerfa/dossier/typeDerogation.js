const typeDerogationSchema = {
  enum: [11, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, null],
  type: Number,
  description:
    "**Type de contrat** :\r\n<br />*Contrat initial*\r\n<br />11 : Premier contrat d’apprentissage de l’apprenti\r\n<br />*Succession de contrats*\r\n<br />21 : Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d’un même employeur\r\n<br />22 : Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d’un autre employeur\r\n<br />23 : Nouveau contrat avec un apprenti dont le précédent contrat auprès d’un autre employeur a été rompu\r\n<br />*Avenant : modification des conditions du contrat*\r\n<br />31 : Modification de la situation juridique de l’employeur\r\n<br />32 : Changement d’employeur dans le cadre d’un contrat saisonnier\r\n<br />33 : Prolongation du contrat suite à un échec à l’examen de l’apprenti\r\n<br />34 : Prolongation du contrat suite à la reconnaissance de l’apprenti comme travailleur handicapé\r\n<br />35 : Modification du diplôme préparé par l’apprenti\r\n<br />36 : Autres changements : changement de maître d’apprentissage, de durée de travail hebdomadaire, réduction de durée, etc.\r\n<br />37 : Modification du lieu d’exécution du contrat",
};

module.exports = typeDerogationSchema;

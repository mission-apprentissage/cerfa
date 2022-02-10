const diplomeSchema = {
  enum: [13, 25, 26, 33, 34, 35, 38, 41, 42, 43, 49, 54, 55, 58, 61, 62, 63, 69, 71, 72, 73, 74, 79, 80, null],
  type: Number,
  description:
    "Il faut sélectionner le diplôme ou le titre préparé avant la conclusion du présent contrat. <br/> Par exemple, si l'entrée en apprentissage concerne la 2ème année de BTS, le dernier diplôme ou titre préparé est la 1ère année de <br/> BTS : il faut donc sélectionner 54 - Brevet de Technicien supérieur.",
  options: [
    {
      name: "Diplôme ou titre de niveau bac +5 et plus",
      options: [
        {
          label: "80: Doctorat",
          value: 80,
        },
        {
          label: "71: Master professionnel/DESS",
          value: 71,
        },
        {
          label: "72: Master recherche/DEA",
          value: 72,
        },
        {
          label: "73: Master indifférencié",
          value: 73,
        },
        {
          label: "74: Diplôme d'ingénieur, diplôme d'école de commerce",
          value: 74,
        },
        {
          label: "79: Autre diplôme ou titre de niveau bac+5 ou plus",
          value: 79,
        },
      ],
    },
    {
      name: "Diplôme ou titre de niveau bac +3 et 4",
      options: [
        {
          label: "61: 1 ère année de Master",
          value: 61,
        },
        {
          label: "62: Licence professionnelle",
          value: 62,
        },
        {
          label: "63: Licence générale",
          value: 63,
        },
        {
          label: "69: Autre diplôme ou titre de niveau bac +3 ou 4",
          value: 69,
        },
      ],
    },
    {
      name: "Diplôme ou titre de niveau bac +2",
      options: [
        {
          label: "54: Brevet de Technicien Supérieur",
          value: 54,
        },
        {
          label: "55: Diplôme Universitaire de technologie",
          value: 55,
        },
        {
          label: "58: Autre diplôme ou titre de niveau bac+2",
          value: 58,
        },
      ],
    },
    {
      name: "Diplôme ou titre de niveau bac",
      options: [
        {
          label: "41: Baccalauréat professionnel",
          value: 41,
        },
        {
          label: "42: Baccalauréat général",
          value: 42,
        },
        {
          label: "43: Baccalauréat technologique",
          value: 43,
        },
        {
          label: "49: Autre diplôme ou titre de niveau bac",
          value: 49,
        },
      ],
    },
    {
      name: "Diplôme ou titre de niveau CAP/BEP",
      options: [
        {
          label: "33: CAP",
          value: 33,
        },
        {
          label: "34: BEP",
          value: 34,
        },
        {
          label: "35: Mention complémentaire",
          value: 35,
        },
        {
          label: "38: Autre diplôme ou titre de niveau CAP/BEP",
          value: 38,
        },
      ],
    },
    {
      name: "Aucun diplôme ni titre",
      options: [
        {
          label: "25: Diplôme national du Brevet",
          value: 25,
        },
        {
          label: "26: Certificat de formation générale",
          value: 26,
        },
        {
          label: "13: Aucun diplôme ni titre professionnel",
          value: 13,
        },
      ],
    },
  ],
};

module.exports = diplomeSchema;

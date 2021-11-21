const diplomeSchema = {
  enum: [13, 25, 26, 33, 34, 35, 38, 41, 42, 43, 49, 54, 55, 58, 61, 62, 63, 69, 71, 72, 73, 74, 79, 80],
  type: Number,
  default: null,
  required: true,
  description:
    "**Diplômes et titres de l'apprenti** : \r\n<br />*Diplôme ou titre de niveau bac +5 et plus*\r\n<br />80 : Doctorat\r\n<br />71 : Master professionnel/DESS\r\n<br />72 : Master recherche/DEA\r\n<br />73 : Master indifférencié\r\n<br />74 : Diplôme d'ingénieur, diplôme d'école de commerce\r\n<br />79 : Autre diplôme ou titre de niveau bac+5 ou plus\r\n<br />*Diplôme ou titre de niveau bac +3 et 4*\r\n<br />61 : 1ère année de Master\r\n<br />62 : Licence professionnelle\r\n<br />63 : Licence générale\r\n<br />69 : Autre diplôme ou titre de niveau bac +3 ou 4\r\n<br />*Diplôme ou titre de niveau bac +2*\r\n<br />54 : Brevet de Technicien Supérieur\r\n<br />55 : Diplôme Universitaire de technologie\r\n<br /> 58 : Autre diplôme ou titre de niveau bac+2\r\n<br />*Diplôme ou titre de niveau bac*\r\n<br /> 41 : Baccalauréat professionnel\r\n<br /> 42 : Baccalauréat général \r\n<br /> 43 : Baccalauréat technologique\r\n<br /> 49 : Autre diplôme ou titre de niveau bac\r\n<br />*Diplôme ou titre de niveau CAP/BEP*\r\n<br /> 33 : CAP\r\n<br /> 34 : BEP\r\n<br /> 35 : Mention complémentaire\r\n<br /> 38 : Autre diplôme ou titre de niveau CAP/BEP\r\n<br />*Aucun diplôme ni titre*\r\n<br /> 25 : Diplôme national du Brevet (DNB)\r\n<br /> 26 : Certificat de formation générale\r\n<br /> 13 : Aucun diplôme ni titre professionnel",
};

module.exports = diplomeSchema;

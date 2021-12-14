const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const moment = require("moment");
const { isFunction, isObject } = require("lodash");

const fieldsPositions = {
  employeur: {
    denomination: {
      x: 28,
      y: 685,
      maxLength: 47,
    },
    adresse: {
      numero: {
        x: 50,
        y: 649,
        maxLength: 9,
      },
      voie: {
        x: 155,
        y: 649,
        maxLength: 25,
        title: (value) => {
          const voieWordToReplace = [
            ["Boulevard", "blvd"],
            ["Avenue", "avn"],
            ["Promenade", "pro"],
          ];
          for (let index = 0; index < voieWordToReplace.length; index++) {
            const [wordToReplace, replaceWith] = voieWordToReplace[index];
            if (value.includes(wordToReplace)) {
              return value.replace(wordToReplace, replaceWith);
            }
          }
          return value;
        },
      },
      complement: {
        x: 95,
        y: 630,
        maxLength: 35,
      },
      codePostal: {
        x: 97,
        y: 610,
        maxLength: 5,
      },
      commune: {
        x: 89,
        y: 592,
        maxLength: 35,
      },
    },
    telephone: {
      x: 90,
      y: 574,
      maxLength: 10,
    },
    courriel: {
      x: 27,
      y: 544,
      maxLength: 47,
      title: async (value, options) => {
        let [user, domain] = value.split("@");
        const helveticaFont = await options.pdfDoc.embedFont(StandardFonts.Helvetica);
        return [
          { text: user },
          { text: "@", options: { color: rgb(0, 0, 0), x: 30 + helveticaFont.widthOfTextAtSize(user, 11) } },
          { text: domain, options: { x: 30 + helveticaFont.widthOfTextAtSize(user + "@", 11) } },
        ];
      },
    },
    siret: {
      x: 305,
      y: 685,
      maxLength: 14,
    },
    typeEmployeur: {
      x: 400,
      y: 669,
      maxLength: 10,
    },
    employeurSpecifique: {
      x: 418,
      y: 648,
      maxLength: 1,
    },
    naf: {
      x: 480,
      y: 630,
      maxLength: 6,
    },
    nombreDeSalaries: {
      x: 305,
      y: 597,
      maxLength: 15,
    },
    libelleIdcc: {
      x: 305,
      y: 560,
      maxLength: 70,
      sliced: "Convention collective ",
    },
    codeIdcc: {
      x: 452,
      y: 530,
      maxLength: 4,
    },
    regimeSpecifique: {
      x: 473,
      y: 513,
      maxLength: 40,
    },
  },
  apprenti: {
    nom: {
      x: 216,
      y: 481,
      maxLength: 100,
    },
    prenom: {
      x: 160,
      y: 464,
      maxLength: 100,
    },
    nir: {
      x: 135,
      y: 445,
      maxLength: 15,
    },
    adresse: {
      numero: {
        x: 39,
        y: 395,
        maxLength: 6,
      },
      voie: {
        x: 110,
        y: 395,
        maxLength: 25,
        title: (value) => {
          const voieWordToReplace = [
            ["Boulevard", "blvd"],
            ["Avenue", "avn"],
            ["Promenade", "pro"],
          ];
          for (let index = 0; index < voieWordToReplace.length; index++) {
            const [wordToReplace, replaceWith] = voieWordToReplace[index];
            if (value.includes(wordToReplace)) {
              return value.replace(wordToReplace, replaceWith);
            }
          }
          return value;
        },
      },
      complement: {
        x: 100,
        y: 376,
        maxLength: 35,
      },
      codePostal: {
        x: 96,
        y: 359,
        maxLength: 5,
      },
      commune: {
        x: 88,
        y: 341,
        maxLength: 30,
      },
    },
    telephone: {
      x: 90,
      y: 324,
      maxLength: 10,
    },
    courriel: {
      x: 27,
      y: 295,
      maxLength: 100,
      title: async (value, options) => {
        let [user, domain] = value.split("@");
        const helveticaFont = await options.pdfDoc.embedFont(StandardFonts.Helvetica);
        return [
          { text: user },
          { text: "@", options: { color: rgb(0, 0, 0), x: 30 + helveticaFont.widthOfTextAtSize(user, 11) } },
          { text: domain, options: { x: 30 + helveticaFont.widthOfTextAtSize(user + "@", 11) } },
        ];
      },
    },
    responsableLegal: {
      nom: {
        x: 28,
        y: 240,
        maxLength: 47,
        title: async (value, options) => {
          const helveticaFont = await options.pdfDoc.embedFont(StandardFonts.Helvetica);
          return [
            { text: value },
            { text: options.prenom, options: { x: 35 + helveticaFont.widthOfTextAtSize(value, 11) } },
          ];
        },
      },
      adresse: {
        numero: {
          x: 40,
          y: 215,
          maxLength: 30,
        },
        voie: {
          x: 110,
          y: 214,
          maxLength: 25,
          title: (value) => {
            const voieWordToReplace = [
              ["Boulevard", "blvd"],
              ["Avenue", "avn"],
              ["Promenade", "pro"],
            ];
            for (let index = 0; index < voieWordToReplace.length; index++) {
              const [wordToReplace, replaceWith] = voieWordToReplace[index];
              if (value.includes(wordToReplace)) {
                return value.replace(wordToReplace, replaceWith);
              }
            }
            return value;
          },
        },
        complement: {
          x: 100,
          y: 197,
          maxLength: 35,
        },
        codePostal: {
          x: 96,
          y: 179,
          maxLength: 30,
        },
        commune: {
          x: 89,
          y: 161,
          maxLength: 30,
        },
      },
    },
    dateNaissance: {
      x: 405,
      y: 442,
      maxLength: 10,
    },
    sexe: {
      x: (value) => {
        return value === "M" ? 340 : 370;
      },
      y: 425,
      title: "X",
      maxLength: 1,
    },
    departementNaissance: {
      x: 445,
      y: 407,
      maxLength: 25,
    },
    communeNaissance: {
      x: 430,
      y: 390,
      maxLength: 20,
    },
    nationalite: {
      x: 365,
      y: 356,
      maxLength: 1,
    },
    regimeSocial: {
      x: 472,
      y: 356,
      maxLength: 1,
    },
    inscriptionSportifDeHautNiveau: {
      x: (value) => {
        return value === true ? 305 : 360;
      },
      y: 317,
      maxLength: 1,
      title: "X",
    },
    handicap: {
      x: (value) => {
        return value === true ? 365 : 418;
      },
      y: 286,
      maxLength: 1,
      title: "X",
    },
    situationAvantContrat: {
      x: 438,
      y: 268,
      maxLength: 2,
    },
    diplomePrepare: {
      x: 468,
      y: 251,
      maxLength: 2,
    },
    derniereClasse: {
      x: 460,
      y: 233,
      maxLength: 2,
    },
    intituleDiplomePrepare: {
      x: 304,
      y: 203,
      maxLength: 45,
    },
    diplome: {
      x: 493,
      y: 185,
      maxLength: 2,
    },
  },
  maitre: {
    maitre1: {
      nom: {
        x: 27,
        y: 98,
        maxLength: 46,
      },
      prenom: {
        x: 27,
        y: 68,
        maxLength: 46,
      },
      dateNaissance: {
        x: 128,
        y: 50,
        maxLength: 10,
      },
    },
    maitre2: {
      nom: {
        x: 304,
        y: 98,
        maxLength: 46,
      },
      prenom: {
        x: 304,
        y: 68,
        maxLength: 46,
      },
      dateNaissance: {
        x: 405,
        y: 50,
        maxLength: 10,
      },
    },
  },
  contrat: {
    typeContratApp: {
      x: 182,
      y: 805,
      maxLength: 2,
    },
    typeDerogation: {
      x: 406,
      y: 802,
      maxLength: 2,
    },
    numeroContratPrecedent: {
      x: 373,
      y: 775,
      maxLength: 25,
    },
    dateConclusion: {
      x: 127,
      y: 756,
      maxLength: 10,
    },
    dateDebutContrat: {
      x: 237,
      y: 743,
      maxLength: 10,
    },
    dateEffetAvenant: {
      x: 505,
      y: 756,
      maxLength: 10,
    },
    dateFinContrat: {
      x: 113,
      y: 692,
      maxLength: 10,
    },
    dureeTravailHebdoHeures: {
      x: 306,
      y: 691,
      maxLength: 2,
    },
    dureeTravailHebdoMinutes: {
      x: 370,
      y: 691,
      maxLength: 2,
    },
    travailRisque: {
      x: (value) => {
        return value === true ? 398 : 453;
      },
      y: 669,
      maxLength: 1,
      title: "X",
    },
    salaireEmbauche: {
      x: 29,
      y: 559,
      maxLength: 10,
    },
    avantageNourriture: {
      x: 252,
      y: 538,
      maxLength: 10,
    },
    avantageLogement: {
      x: 408,
      y: 538,
      maxLength: 10,
    },
    autreAvantageEnNature: {
      x: 555,
      y: 538,
      maxLength: 10,
    },
    remunerationsAnnuelles: {
      1.1: {
        dateDebut: {
          x: 85,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      1.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170 + 255,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236 + 255,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      2.1: {
        dateDebut: {
          x: 85,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632 - 12,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      2.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236 + 255,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632 - 12,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      3.1: {
        dateDebut: {
          x: 85,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632 - 25,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      3.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236 + 255,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632 - 25,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      4.1: {
        dateDebut: {
          x: 85,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285,
          y: 632 - 40,
          maxLength: 4,
          defaultSize: 9,
        },
      },
      4.2: {
        dateDebut: {
          x: 85 + 255,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        taux: {
          x: 236 + 255,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
        },
        typeSalaire: {
          x: 285 + 255,
          y: 632 - 40,
          maxLength: 4,
          defaultSize: 9,
        },
      },
    },
  },
  formation: {
    formationInterne: {
      x: (value) => {
        return value === true ? 123 : 177;
      },
      y: 503,
      maxLength: 1,
      title: "X",
    },
    denomination: {
      x: 27,
      y: 477,
      maxLength: 47,
    },
    intituleQualification: {
      x: 380,
      y: 491,
      maxLength: 35,
    },
    typeDiplome: {
      x: 480,
      y: 504,
      maxLength: 2,
    },
    uaiCfa: {
      x: 110,
      y: 463,
      maxLength: 8,
    },
    codeDiplome: {
      x: 396,
      y: 463,
      maxLength: 8,
    },
    siret: {
      x: 109,
      y: 448,
      maxLength: 14,
    },
    rncp: {
      x: 376,
      y: 449,
      maxLength: 9,
    },
    adresse: {
      numero: {
        x: 41,
        y: 416,
        maxLength: 4,
      },
      voie: {
        x: 109,
        y: 415,
        maxLength: 25,
        title: (value) => {
          const voieWordToReplace = [
            ["Boulevard", "blvd"],
            ["Avenue", "avn"],
            ["Promenade", "pro"],
          ];
          for (let index = 0; index < voieWordToReplace.length; index++) {
            const [wordToReplace, replaceWith] = voieWordToReplace[index];
            if (value.includes(wordToReplace)) {
              return value.replace(wordToReplace, replaceWith);
            }
          }
          return value;
        },
      },
      complement: {
        x: 99,
        y: 398,
        maxLength: 25,
      },
      codePostal: {
        x: 97,
        y: 380,
        maxLength: 5,
      },
      commune: {
        x: 89,
        y: 362,
        maxLength: 30,
      },
    },
    dateDebutFormation: {
      x: 304,
      y: 403,
      maxLength: 10,
    },
    dateFinFormation: {
      x: 304,
      y: 371,
      maxLength: 10,
    },
    dureeFormation: {
      x: 419,
      y: 357,
      maxLength: 2,
    },
  },
};
const capitalizeFirstLetter = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const slicedLetter = (str, value) => capitalizeFirstLetter(str.toLowerCase().slice(value.length));

const buildFieldDraw = async (value, fieldDefinition, options = {}) => {
  const isDate = moment.isDate(value) ? moment(value).utc().format("MM/DD/YYYY") : `${value}`;
  const title = typeof value === "boolean" ? (value ? "X" : " ") : isDate;
  const result = {
    title:
      (isFunction(fieldDefinition.title) ? await fieldDefinition.title(value, options) : fieldDefinition.title) ||
      title,
    x: isFunction(fieldDefinition.x) ? await fieldDefinition.x(value, options) : fieldDefinition.x,
    y: fieldDefinition.y,
    sliced: fieldDefinition.sliced ? fieldDefinition.sliced : "",
    defaultColor: rgb(0.9, 0.4, 0.3),
    defaultSize: fieldDefinition.defaultSize ? fieldDefinition.defaultSize : 11,
  };

  if (fieldDefinition.maxLength && (value?.length || 0) > fieldDefinition.maxLength) {
    result.title = value.slice(0, fieldDefinition.maxLength - 1) + ".";
  }
  return result;
};

const buildRemunerations = async (remunerationsAnnuelles) => {
  let result = [];
  for (let index = 0; index < remunerationsAnnuelles.length; index++) {
    const remunerationAnnuelle = remunerationsAnnuelles[index];
    result = [
      ...result,
      await buildFieldDraw(
        remunerationAnnuelle.dateDebut,
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].dateDebut
      ),
      await buildFieldDraw(
        remunerationAnnuelle.dateFin,
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].dateFin
      ),
      await buildFieldDraw(
        remunerationAnnuelle.taux,
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].taux
      ),
      await buildFieldDraw(
        remunerationAnnuelle.typeSalaire,
        fieldsPositions.contrat.remunerationsAnnuelles[remunerationAnnuelle.ordre].typeSalaire
      ),
    ];
  }

  return result;
};

module.exports = async (pdfCerfaEmpty, cerfa) => {
  const pdfDoc = await PDFDocument.load(pdfCerfaEmpty);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  const pdfPagesContent = [
    [
      // TODO EMPLOYEUR
      await buildFieldDraw(cerfa.employeur.denomination, fieldsPositions.employeur.denomination),
      await buildFieldDraw(cerfa.employeur.adresse.numero, fieldsPositions.employeur.adresse.numero),
      await buildFieldDraw(cerfa.employeur.adresse.voie, fieldsPositions.employeur.adresse.voie),
      await buildFieldDraw(cerfa.employeur.adresse.complement, fieldsPositions.employeur.adresse.complement),
      await buildFieldDraw(cerfa.employeur.adresse.codePostal, fieldsPositions.employeur.adresse.codePostal),
      await buildFieldDraw(cerfa.employeur.adresse.commune, fieldsPositions.employeur.adresse.commune),
      await buildFieldDraw(cerfa.employeur.telephone, fieldsPositions.employeur.telephone),
      await buildFieldDraw(cerfa.employeur.courriel, fieldsPositions.employeur.courriel, { pdfDoc }),
      await buildFieldDraw(cerfa.employeur.siret, fieldsPositions.employeur.siret),
      await buildFieldDraw(cerfa.employeur.typeEmployeur, fieldsPositions.employeur.typeEmployeur),
      await buildFieldDraw(cerfa.employeur.employeurSpecifique, fieldsPositions.employeur.employeurSpecifique),
      await buildFieldDraw(cerfa.employeur.naf, fieldsPositions.employeur.naf),
      await buildFieldDraw(cerfa.employeur.nombreDeSalaries, fieldsPositions.employeur.nombreDeSalaries),
      await buildFieldDraw(cerfa.employeur.libelleIdcc, fieldsPositions.employeur.libelleIdcc),
      await buildFieldDraw(cerfa.employeur.codeIdcc, fieldsPositions.employeur.codeIdcc),
      await buildFieldDraw(cerfa.employeur.regimeSpecifique, fieldsPositions.employeur.regimeSpecifique),

      //TODO APPRENTI(E)
      await buildFieldDraw(cerfa.apprenti.nom, fieldsPositions.apprenti.nom),
      await buildFieldDraw(cerfa.apprenti.prenom, fieldsPositions.apprenti.prenom),
      await buildFieldDraw(cerfa.apprenti.nir, fieldsPositions.apprenti.nir),
      await buildFieldDraw(cerfa.apprenti.adresse.numero, fieldsPositions.apprenti.adresse.numero),
      await buildFieldDraw(cerfa.apprenti.adresse.voie, fieldsPositions.apprenti.adresse.voie),
      await buildFieldDraw(cerfa.apprenti.adresse.complement, fieldsPositions.apprenti.adresse.complement),
      await buildFieldDraw(cerfa.apprenti.adresse.codePostal, fieldsPositions.apprenti.adresse.codePostal),
      await buildFieldDraw(cerfa.apprenti.adresse.commune, fieldsPositions.apprenti.adresse.commune),
      await buildFieldDraw(cerfa.apprenti.telephone, fieldsPositions.apprenti.telephone),
      await buildFieldDraw(cerfa.apprenti.courriel, fieldsPositions.apprenti.courriel, { pdfDoc }),
      await buildFieldDraw(cerfa.apprenti.responsableLegal.nom, fieldsPositions.apprenti.responsableLegal.nom, {
        prenom: cerfa.apprenti.responsableLegal.prenom,
        pdfDoc,
      }),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.numero,
        fieldsPositions.apprenti.responsableLegal.adresse.numero
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.voie,
        fieldsPositions.apprenti.responsableLegal.adresse.voie
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.complement,
        fieldsPositions.apprenti.responsableLegal.adresse.complement
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.codePostal,
        fieldsPositions.apprenti.responsableLegal.adresse.codePostal
      ),
      await buildFieldDraw(
        cerfa.apprenti.responsableLegal.adresse.commune,
        fieldsPositions.apprenti.responsableLegal.adresse.commune
      ),
      await buildFieldDraw(cerfa.apprenti.dateNaissance, fieldsPositions.apprenti.dateNaissance),
      await buildFieldDraw(cerfa.apprenti.sexe, fieldsPositions.apprenti.sexe),
      await buildFieldDraw(cerfa.apprenti.departementNaissance, fieldsPositions.apprenti.departementNaissance),
      await buildFieldDraw(cerfa.apprenti.communeNaissance, fieldsPositions.apprenti.communeNaissance),
      await buildFieldDraw(cerfa.apprenti.nationalite, fieldsPositions.apprenti.nationalite),
      await buildFieldDraw(cerfa.apprenti.regimeSocial, fieldsPositions.apprenti.regimeSocial),
      await buildFieldDraw(
        cerfa.apprenti.inscriptionSportifDeHautNiveau,
        fieldsPositions.apprenti.inscriptionSportifDeHautNiveau
      ),
      await buildFieldDraw(cerfa.apprenti.handicap, fieldsPositions.apprenti.handicap),
      await buildFieldDraw(cerfa.apprenti.situationAvantContrat, fieldsPositions.apprenti.situationAvantContrat),
      await buildFieldDraw(cerfa.apprenti.diplomePrepare, fieldsPositions.apprenti.diplomePrepare),
      await buildFieldDraw(cerfa.apprenti.intituleDiplomePrepare, fieldsPositions.apprenti.intituleDiplomePrepare),
      await buildFieldDraw(cerfa.apprenti.derniereClasse, fieldsPositions.apprenti.derniereClasse),
      await buildFieldDraw(cerfa.apprenti.diplome, fieldsPositions.apprenti.diplome),

      //TODO Maitre d'aprentissage
      await buildFieldDraw(cerfa.maitre1.nom, fieldsPositions.maitre.maitre1.nom),
      await buildFieldDraw(cerfa.maitre1.prenom, fieldsPositions.maitre.maitre1.prenom),
      await buildFieldDraw(cerfa.maitre1.dateNaissance, fieldsPositions.maitre.maitre1.dateNaissance),
      await buildFieldDraw(cerfa.maitre2.nom, fieldsPositions.maitre.maitre2.nom),
      await buildFieldDraw(cerfa.maitre2.prenom, fieldsPositions.maitre.maitre2.prenom),
      await buildFieldDraw(cerfa.maitre2.dateNaissance, fieldsPositions.maitre.maitre2.dateNaissance),
    ],
    [
      //TODO Le Contrat
      await buildFieldDraw(cerfa.contrat.typeContratApp, fieldsPositions.contrat.typeContratApp),
      await buildFieldDraw(cerfa.contrat.typeDerogation, fieldsPositions.contrat.typeDerogation),
      await buildFieldDraw(cerfa.contrat.numeroContratPrecedent, fieldsPositions.contrat.numeroContratPrecedent),
      await buildFieldDraw(cerfa.contrat.dateConclusion, fieldsPositions.contrat.dateConclusion),
      await buildFieldDraw(cerfa.contrat.dateDebutContrat, fieldsPositions.contrat.dateDebutContrat),
      await buildFieldDraw(cerfa.contrat.dateEffetAvenant, fieldsPositions.contrat.dateEffetAvenant),
      await buildFieldDraw(cerfa.contrat.dateFinContrat, fieldsPositions.contrat.dateFinContrat),
      await buildFieldDraw(cerfa.contrat.dureeTravailHebdoHeures, fieldsPositions.contrat.dureeTravailHebdoHeures),
      await buildFieldDraw(cerfa.contrat.dureeTravailHebdoMinutes, fieldsPositions.contrat.dureeTravailHebdoMinutes),
      await buildFieldDraw(cerfa.contrat.travailRisque, fieldsPositions.contrat.travailRisque),
      ...(await buildRemunerations(cerfa.contrat.remunerationsAnnuelles)),
      await buildFieldDraw(cerfa.contrat.salaireEmbauche, fieldsPositions.contrat.salaireEmbauche),
      await buildFieldDraw(cerfa.contrat.avantageNourriture, fieldsPositions.contrat.avantageNourriture),
      await buildFieldDraw(cerfa.contrat.avantageLogement, fieldsPositions.contrat.avantageLogement),
      await buildFieldDraw(cerfa.contrat.autreAvantageEnNature, fieldsPositions.contrat.autreAvantageEnNature),

      //TODO La Formation
      await buildFieldDraw(cerfa.organismeFormation.formationInterne, fieldsPositions.formation.formationInterne),
      await buildFieldDraw(cerfa.organismeFormation.uaiCfa, fieldsPositions.formation.uaiCfa),
      await buildFieldDraw(cerfa.organismeFormation.siret, fieldsPositions.formation.siret),
      await buildFieldDraw(cerfa.organismeFormation.denomination, fieldsPositions.formation.denomination),

      await buildFieldDraw(cerfa.formation.rncp, fieldsPositions.formation.rncp),
      await buildFieldDraw(cerfa.formation.codeDiplome, fieldsPositions.formation.codeDiplome),
      await buildFieldDraw(cerfa.formation.intituleQualification, fieldsPositions.formation.intituleQualification),
      await buildFieldDraw(cerfa.formation.typeDiplome, fieldsPositions.formation.typeDiplome),
      await buildFieldDraw(cerfa.formation.dateDebutFormation, fieldsPositions.formation.dateDebutFormation),
      await buildFieldDraw(cerfa.formation.dateFinFormation, fieldsPositions.formation.dateFinFormation),
      await buildFieldDraw(cerfa.formation.dureeFormation, fieldsPositions.formation.dureeFormation),

      await buildFieldDraw(cerfa.organismeFormation.adresse.numero, fieldsPositions.formation.adresse.numero),
      await buildFieldDraw(cerfa.organismeFormation.adresse.voie, fieldsPositions.formation.adresse.voie),
      await buildFieldDraw(cerfa.organismeFormation.adresse.complement, fieldsPositions.formation.adresse.complement),
      await buildFieldDraw(cerfa.organismeFormation.adresse.codePostal, fieldsPositions.formation.adresse.codePostal),
      await buildFieldDraw(cerfa.organismeFormation.adresse.commune, fieldsPositions.formation.adresse.commune),
    ],
  ];

  for (let index = 0; index < pdfPagesContent.length; index++) {
    const pdfPageContent = pdfPagesContent[index];
    const page = pages[index];
    for (let jndex = 0; jndex < pdfPageContent.length; jndex++) {
      const { title, x, y, sliced, defaultColor, defaultSize } = pdfPageContent[jndex];
      let pablo = Array.isArray(title) ? title : [title];
      pablo.forEach((t) => {
        let text = isObject(t) ? t.text : t;
        const titles = slicedLetter(text, sliced);
        for (let kndex = 0; kndex < titles.length; kndex++) {
          page.drawText(titles, {
            x: x,
            y: y,
            size: defaultSize,
            color: defaultColor,
            font: helveticaFont,
            ...(t.options || {}),
          });
        }
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

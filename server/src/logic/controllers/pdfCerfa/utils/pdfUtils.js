const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const { isFunction, isObject, findIndex } = require("lodash");
const typeVoie = require("../../../../common/constants/typeVoie");
const { DateTime } = require("luxon");

const strTransform = (value, transformType) => {
  if (transformType === "toLowerCase") return value.toLowerCase();
  if (transformType === "toUpperCase") return value.toUpperCase();
  return value;
};
const shortenVoie = (value, transformType) => {
  const matchIndex = findIndex(typeVoie, (item) =>
    strTransform(value, transformType).includes(strTransform(item.libelle, transformType))
  );
  let replacer = null;
  if (matchIndex !== -1) replacer = typeVoie[matchIndex];
  if (!replacer) return null;

  return strTransform(value, transformType)
    .trim()
    .replace(strTransform(replacer.libelle, transformType), replacer.code);
};

const splitMultipleLines = (value, maxLength) => {
  const reg = new RegExp(`.{1,${maxLength}}(\\s|$)`, "g");
  const chunks = value.match(reg);

  return chunks;
};

const convertDate = (value) =>
  value
    ? DateTime.fromMillis(value.valueOf()).setZone("Europe/Paris").setLocale("fr-FR").toFormat("dd/MM/yyyy")
    : undefined;

const fieldsPositions = {
  employeur: {
    denomination: {
      x: 25,
      title: (value) => {
        let newValue = value.toLowerCase();

        const result = [];
        const maxLine = 2;
        const maxCharacters = 45;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 687;
        if (lines.length > 1) yFirstLine = 690;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }

        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    adresse: {
      numero: {
        x: 50,
        y: 649,
        maxLength: 9,
      },
      voie: {
        x: 152,
        maxLength: 30,
        title: (value) => {
          let shorttened = shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

          let newValue = shorttened?.toLowerCase() || value.toLowerCase();

          const result = [];
          const maxLine = 2;
          const maxCharacters = 25;
          const lines = splitMultipleLines(newValue, maxCharacters);
          let yFirstLine = 649;
          if (lines.length > 1) yFirstLine = 657;
          for (let index = 0; index < lines.length; index++) {
            if (index === maxLine) break;
            const line = lines[index];
            result.push({ text: line, options: { y: yFirstLine - index * 12 } });
          }
          if (lines.length > maxLine) {
            result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
          }

          return result;
        },
      },
      complement: {
        x: 96,
        y: 631,
        maxLength: 35,
        title: (value) => value.toLowerCase(),
      },
      codePostal: {
        x: 97,
        y: 610,
        maxLength: 5,
        title: (value) => value.toLowerCase(),
      },
      commune: {
        x: 89,
        y: 592,
        maxLength: 35,
        title: (value) => value.toLowerCase(),
      },
    },
    telephone: {
      x: 90,
      y: 574,
      maxLength: 15,
      title: (value) => {
        let newValue = value.replace("+33", "0");
        return newValue.match(/\d{2}/g).join(" ");
      },
    },
    courriel: {
      x: 27,
      y: 544,
      maxLength: 50,
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
      maxLength: 28,
      title: (value) => {
        return value.match(/\d{1}/g).join(" ");
      },
    },
    privePublic: {
      x: 391,
      y: 711,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
    typeEmployeur: {
      x: 400,
      y: 669,
      maxLength: 10,
    },
    employeurSpecifique: {
      x: 418,
      y: 649,
      maxLength: 1,
      title: (value) => `${value}`,
    },
    naf: {
      x: 480,
      y: 630,
      maxLength: 6,
      title: (value) => value.toUpperCase(),
    },
    nombreDeSalaries: {
      x: 483,
      y: 612,
      maxLength: 15,
    },
    libelleIdcc: {
      x: 305,
      title: (value) => {
        let newValue = value.replace("Convention collective ", "").toLowerCase();

        const result = [];
        const maxLine = 3;
        const maxCharacters = 43;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 563;
        if (lines.length > 1) yFirstLine = 566;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    codeIdcc: {
      x: 452,
      y: 530,
      maxLength: 4,
    },
    regimeSpecifique: {
      x: 473,
      y: 513,
      maxLength: 3,
      title: (value) => (value ? "oui" : "non"),
    },
    attestationEligibilite: {
      x: 23,
      y: 23,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
    attestationPieces: {
      x: 478,
      y: 249,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
  },
  apprenti: {
    nom: {
      x: 216,
      y: 483,
      maxLength: 100,
    },
    prenom: {
      x: 160,
      y: 465,
      maxLength: 100,
    },
    nir: {
      x: 135,
      y: 445,
      maxLength: 15,
      title: (value) => {
        return value?.match(/\d{1}/g).join(" ") || "";
      },
    },
    adresse: {
      numero: {
        x: 39,
        y: 395,
        maxLength: 6,
      },
      voie: {
        x: 110,
        title: (value) => {
          let shorttened = shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

          let newValue = shorttened?.toLowerCase() || value.toLowerCase();

          const result = [];
          const maxLine = 2;
          const maxCharacters = 32;
          const lines = splitMultipleLines(newValue, maxCharacters);
          let yFirstLine = 395;
          if (lines.length > 1) yFirstLine = 399;
          for (let index = 0; index < lines.length; index++) {
            if (index === maxLine) break;
            const line = lines[index];
            result.push({ text: line, options: { y: yFirstLine - index * 11 } });
          }
          if (lines.length > maxLine) {
            result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
          }

          return result;
        },
      },
      complement: {
        x: 97,
        y: 376,
        maxLength: 35,
        title: (value) => value.toLowerCase(),
      },
      codePostal: {
        x: 94,
        y: 360,
        maxLength: 5,
        title: (value) => value.toLowerCase(),
      },
      commune: {
        x: 86,
        y: 343,
        maxLength: 39,
        title: (value) => value.toLowerCase(),
      },
    },
    telephone: {
      x: 88,
      y: 324,
      maxLength: 15,
      title: (value) => {
        let newValue = value.replace("+33", "0");
        return newValue.match(/\d{2}/g).join(" ");
      },
    },
    courriel: {
      x: 27,
      y: 295,
      maxLength: 50,
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
        y: 242,
        maxLength: 47,
        title: async (value, options) => {
          const helveticaFont = await options.pdfDoc.embedFont(StandardFonts.Helvetica);
          return [
            { text: value || "" },
            { text: options.prenom, options: { x: 35 + helveticaFont.widthOfTextAtSize(value || "", 11) } },
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
          x: 104,
          title: (value) => {
            let shorttened =
              shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

            let newValue = shorttened?.toLowerCase() || value.toLowerCase();

            const result = [];
            const maxLine = 2;
            const maxCharacters = 32;
            const lines = splitMultipleLines(newValue, maxCharacters);
            let yFirstLine = 215;
            if (lines.length > 1) yFirstLine = 219;
            for (let index = 0; index < lines.length; index++) {
              if (index === maxLine) break;
              const line = lines[index];
              result.push({ text: line, options: { y: yFirstLine - index * 11 } });
            }
            if (lines.length > maxLine) {
              result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
            }

            return result;
          },
        },
        complement: {
          x: 98,
          y: 197,
          maxLength: 35,
          title: (value) => value.toLowerCase(),
        },
        codePostal: {
          x: 94,
          y: 179,
          maxLength: 30,
          title: (value) => value.toLowerCase(),
        },
        commune: {
          x: 87,
          y: 162,
          maxLength: 30,
          title: (value) => value.toLowerCase(),
        },
      },
    },
    dateNaissance: {
      x: 400,
      y: 442,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    sexe: {
      x: (value) => {
        return value === "M" ? 338 : 368;
      },
      y: 422,
      title: "×",
      defaultSize: 24,
      maxLength: 1,
    },
    departementNaissance: {
      x: 443,
      y: 408,
      maxLength: 25,
      title: (value) => value.toLowerCase(),
    },
    communeNaissance: {
      x: 430,
      y: 391,
      maxLength: 20,
      title: (value) => value.toLowerCase(),
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
        return value === true ? 303 : 358;
      },
      y: 313,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
    },
    handicap: {
      x: (value) => {
        return value === true ? 362 : 413;
      },
      y: 283,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
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
      title: (value) => {
        let newValue = value.toLowerCase();
        const result = [];
        const maxLine = 2;
        const maxCharacters = 45;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 203;
        if (lines.length > 1) yFirstLine = 208;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
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
        y: 101,
        maxLength: 46,
        title: (value) => value.toLowerCase(),
      },
      prenom: {
        x: 27,
        y: 68,
        maxLength: 46,
        title: (value) => value.toLowerCase(),
      },
      dateNaissance: {
        x: 127,
        y: 51,
        maxLength: 10,
        title: (value) => convertDate(value),
      },
    },
    maitre2: {
      nom: {
        x: 304,
        y: 98,
        maxLength: 46,
        title: (value) => value.toLowerCase(),
      },
      prenom: {
        x: 304,
        y: 68,
        maxLength: 46,
        title: (value) => value.toLowerCase(),
      },
      dateNaissance: {
        x: 405,
        y: 51,
        maxLength: 10,
        title: (value) => convertDate(value),
      },
    },
  },
  contrat: {
    lieuSignatureContrat: {
      x: 65,
      y: 231,
      maxLength: 100,
      title: (value) => value.toLowerCase(),
    },
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
      maxLength: 30,
      title: (value) => {
        return value.match(/.{1}/g).join(" ");
      },
    },
    dateConclusion: {
      x: 127,
      y: 756,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dateDebutContrat: {
      x: 237,
      y: 743,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dateEffetAvenant: {
      x: 505,
      y: 756,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dateFinContrat: {
      x: 113,
      y: 692,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dureeTravailHebdoHeures: {
      x: 306,
      y: 692,
      maxLength: 2,
    },
    dureeTravailHebdoMinutes: {
      x: 370,
      y: 692,
      maxLength: 2,
    },
    travailRisque: {
      x: (value) => {
        return value === true ? 398 : 453;
      },
      y: 667,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
    },
    salaireEmbauche: {
      x: 29,
      y: 559,
      maxLength: 10,
    },
    caisseRetraiteComplementaire: {
      x: 310,
      y: 559,
      maxLength: 40,
    },
    avantageNourriture: {
      x: 252,
      y: 539,
      maxLength: 10,
    },
    avantageLogement: {
      x: 408,
      y: 539,
      maxLength: 10,
    },
    autreAvantageEnNature: {
      x: 552,
      y: 536,
      maxLength: 1,
      title: (value) => (value ? "×" : ""),
      defaultSize: 24,
    },
    remunerationsAnnuelles: {
      1.1: {
        dateDebut: {
          x: 85,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
        },
        taux: {
          x: 236,
          y: 632,
          maxLength: 3,
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
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170 + 255,
          y: 632,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
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
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
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
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 12,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
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
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
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
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 25,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
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
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
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
          title: (value) => convertDate(value),
        },
        dateFin: {
          x: 170 + 255,
          y: 632 - 40,
          maxLength: 10,
          defaultSize: 9,
          title: (value) => convertDate(value),
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
      y: 501,
      maxLength: 1,
      title: "×",
      defaultSize: 24,
    },
    denomination: {
      x: 27,
      title: (value) => {
        let newValue = value.toLowerCase();

        const result = [];
        const maxLine = 2;
        const maxCharacters = 45;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 478;
        if (lines.length > 1) yFirstLine = 483;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
    },
    intituleQualification: {
      x: 302,
      title: (value) => {
        let newValue = value.toLowerCase();
        const result = [];
        const maxLine = 2;
        const maxCharacters = 42;
        const lines = splitMultipleLines(newValue, maxCharacters);
        let yFirstLine = 480;
        if (lines.length > 1) yFirstLine = 484;
        for (let index = 0; index < lines.length; index++) {
          if (index === maxLine) break;
          const line = lines[index];
          result.push({ text: line, options: { y: yFirstLine - index * 10 } });
        }
        if (lines.length > maxLine) {
          result[maxLine - 1].text = result[maxLine - 1].text.slice(0, maxCharacters - 1) + "…";
        }

        return result;
      },
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
      title: (value) => value.toUpperCase(),
    },
    codeDiplome: {
      x: 396,
      y: 463,
      maxLength: 8,
      title: (value) => value.toUpperCase(),
    },
    siret: {
      x: 109,
      y: 448,
      maxLength: 28,
      title: (value) => {
        return value.match(/\d{1}/g).join(" ");
      },
    },
    rncp: {
      x: 376,
      y: 449,
      maxLength: 9,
      title: (value) => value.toUpperCase(),
    },
    adresse: {
      numero: {
        x: 41,
        y: 416,
        maxLength: 4,
      },
      voie: {
        x: 109,
        // y: 415,
        // maxLength: 25,
        title: (value) => {
          let shorttened = shortenVoie(value) || shortenVoie(value, "toLowerCase") || shortenVoie(value, "toUpperCase");

          let newValue = shorttened?.toLowerCase() || value.toLowerCase();

          const result = [];
          const lines = splitMultipleLines(newValue, 37);
          let yFirstLine = 415;
          if (lines.length > 1) yFirstLine = 415;
          for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            result.push({ text: line, options: { y: yFirstLine - index * 11 } });
          }

          return result;
        },
      },
      complement: {
        x: 99,
        y: 398,
        maxLength: 40,
        title: (value) => value.toLowerCase(),
      },
      codePostal: {
        x: 97,
        y: 381,
        maxLength: 5,
        title: (value) => value.toLowerCase(),
      },
      commune: {
        x: 89,
        y: 363,
        maxLength: 30,
        title: (value) => value.toLowerCase(),
      },
    },
    dateDebutFormation: {
      x: 304,
      y: 403,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dateFinFormation: {
      x: 304,
      y: 373,
      maxLength: 10,
      title: (value) => convertDate(value),
    },
    dureeFormation: {
      x: 419,
      y: 357,
      maxLength: 8,
    },
  },
};
const capitalizeFirstLetter = (value) => value?.charAt(0).toUpperCase() + value?.slice(1);

const buildFieldDraw = async (value, fieldDefinition, options = {}) => {
  const title = typeof value === "boolean" ? (value ? "×" : " ") : !value ? "" : `${value}`;
  const result = {
    title:
      (isFunction(fieldDefinition.title) ? await fieldDefinition.title(value, options) : fieldDefinition.title) ||
      title,
    x: isFunction(fieldDefinition.x) ? await fieldDefinition.x(value, options) : fieldDefinition.x,
    y: fieldDefinition.y,
    defaultColor: rgb(0.05, 0.51, 0.49), // rgb(0.13, 0.59, 0.49), //rgb(0.9, 0.4, 0.3),
    defaultSize: fieldDefinition.defaultSize ? fieldDefinition.defaultSize : 10,
  };

  if (fieldDefinition.maxLength && (result.title?.length || 0) > fieldDefinition.maxLength) {
    result.title = result.title.slice(0, fieldDefinition.maxLength - 1) + ".";
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
  const writtingFont = await pdfDoc.embedFont(StandardFonts.Courier); // TimesRoman // Courier // Helvetica
  const pages = pdfDoc.getPages();

  const pdfPagesContent = [
    [
      // TODO EMPLOYEUR
      await buildFieldDraw(cerfa.employeur.privePublic, fieldsPositions.employeur.privePublic),
      await buildFieldDraw(cerfa.employeur.denomination, fieldsPositions.employeur.denomination),
      await buildFieldDraw(cerfa.employeur.adresse.numero, fieldsPositions.employeur.adresse.numero),
      await buildFieldDraw(cerfa.employeur.adresse.voie, fieldsPositions.employeur.adresse.voie),
      await buildFieldDraw(cerfa.employeur.adresse.complement, fieldsPositions.employeur.adresse.complement),
      await buildFieldDraw(cerfa.employeur.adresse.codePostal, fieldsPositions.employeur.adresse.codePostal),
      await buildFieldDraw(cerfa.employeur.adresse.commune, fieldsPositions.employeur.adresse.commune),
      await buildFieldDraw(cerfa.employeur.telephone, fieldsPositions.employeur.telephone),
      await buildFieldDraw(cerfa.employeur.courriel, fieldsPositions.employeur.courriel, { pdfDoc }),
      await buildFieldDraw(cerfa.employeur.siret, fieldsPositions.employeur.siret, { pdfDoc }),
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
      await buildFieldDraw(cerfa.employeur.attestationEligibilite, fieldsPositions.employeur.attestationEligibilite),
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
      await buildFieldDraw(
        cerfa.contrat.caisseRetraiteComplementaire,
        fieldsPositions.contrat.caisseRetraiteComplementaire
      ),
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

      await buildFieldDraw(cerfa.employeur.attestationPieces, fieldsPositions.employeur.attestationPieces),
      await buildFieldDraw(cerfa.contrat.lieuSignatureContrat, fieldsPositions.contrat.lieuSignatureContrat),
    ],
  ];

  for (let index = 0; index < pdfPagesContent.length; index++) {
    const pdfPageContent = pdfPagesContent[index];
    const page = pages[index];
    for (let jndex = 0; jndex < pdfPageContent.length; jndex++) {
      const { title, x, y, defaultColor, defaultSize } = pdfPageContent[jndex];
      let arrTitles = Array.isArray(title) ? title : [title];
      arrTitles.forEach((t, ite) => {
        let text = isObject(t) ? t.text : t;
        const titles = ite === 0 ? capitalizeFirstLetter(text) : text;
        for (let kndex = 0; kndex < titles.length; kndex++) {
          page.drawText(titles, {
            x: x,
            y: y,
            size: defaultSize,
            color: defaultColor,
            font: writtingFont,
            ...(t.options || {}),
          });
        }
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

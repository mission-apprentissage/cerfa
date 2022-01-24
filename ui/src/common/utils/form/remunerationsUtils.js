import { DateTime } from "luxon";

const SMICs = {
  2022: {
    smics: [
      {
        annee: 2022,
        mensuel: 1603.12,
        horaire: 10.57,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.76,
        dateEntreeEnVigueur: "01/01/2022",
        dateEntreeEnVigueurObj: DateTime.fromISO("01/01/2022").setLocale("fr-FR"),
        dateParutionJo: "22/12/2021",
        dateParutionJoObj: DateTime.fromISO("22/12/2021").setLocale("fr-FR"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1210.3,
            horaire: 7.98,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2021: {
    smics: [
      {
        annee: 2021,
        mensuel: 1589.47,
        horaire: 10.48,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.73,
        dateEntreeEnVigueur: "01/10/2021",
        dateEntreeEnVigueurObj: DateTime.fromISO("01/10/2021").setLocale("fr-FR"),
        dateParutionJo: "30/09/2021",
        dateParutionJoObj: DateTime.fromISO("30/09/2021").setLocale("fr-FR"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1199.08,
            horaire: 7.91,
            heuresHebdomadaires: 35,
          },
        },
      },
      {
        annee: 2021,
        mensuel: 1554.58,
        horaire: 10.25,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.65,
        dateEntreeEnVigueur: "01/01/2021",
        dateEntreeEnVigueurObj: DateTime.fromISO("01/01/2021").setLocale("fr-FR"),
        dateParutionJo: "17/12/2020",
        dateParutionJoObj: DateTime.fromISO("17/12/2020").setLocale("fr-FR"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1173.27,
            horaire: 7.74,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
};

const findSmicAtDate = (lookupDate) => {
  const { year: currentYear } = DateTime.now().setLocale("fr-FR").toObject();
  const lookupDateObj = lookupDate.toObject();
  const lookupYear = lookupDateObj.year;

  if (!SMICs[lookupYear]) {
    return SMICs[currentYear].smics[0]; // latest smic
  }

  let smicsArray = SMICs[lookupYear].smics;

  let smicObjResult = null;
  let indexToSmic = 0;
  for (let i = 0; i < smicsArray.length; i++) {
    const smicObj = smicsArray[i];
    if (lookupDate >= smicObj.dateEntreeEnVigueurObj) {
      indexToSmic = i;
    }
  }
  smicObjResult = smicsArray[indexToSmic];

  return smicObjResult;
};

export const buildRemunerationsDbValue = (remunerationsAnnuellesFormValue) => {
  const remunerationsAnnuellesDbValue = [];
  const remKeys = Object.keys(remunerationsAnnuellesFormValue);
  for (let index = 0; index < remKeys.length; index++) {
    const remKey = remKeys[index];
    const remPart = remunerationsAnnuellesFormValue[remKey];
    if (remPart.taux.value > 0) {
      remunerationsAnnuellesDbValue.push({
        dateDebut: DateTime.fromISO(remPart.dateDebut.value).setLocale("fr-FR").ts,
        dateFin: DateTime.fromISO(remPart.dateFin.value).setLocale("fr-FR").ts,
        taux: remPart.taux.value,
        tauxMinimal: remPart.tauxMinimal.value,
        typeSalaire: remPart.typeSalaire.value,
        salaireBrut: remPart.salaireBrut.value.toFixed(2),
        ordre: `${remKey[0]}.${remKey[1]}`,
      });
    }
  }

  return {
    remunerationsAnnuellesDbValue,
    salaireEmbauche: remunerationsAnnuellesFormValue["11"].salaireBrut.value,
  };
};

export const buildRemunerations = (data) => {
  const previous = data.remunerationsAnnuelles;
  const dateDebutContrat = DateTime.fromISO(data.dateDebutContrat).setLocale("fr-FR");
  const dateFinContrat = DateTime.fromISO(data.dateFinContrat).setLocale("fr-FR");
  const apprentiDateNaissance = DateTime.fromISO(data.apprentiDateNaissance).setLocale("fr-FR");

  const dateFinA1 = dateDebutContrat.plus({ years: 1 }).minus({ days: 1 });
  const dateDebutA2 = dateDebutContrat.plus({ years: 1 });
  const dateFinA2 = dateDebutA2.plus({ years: 1 }).minus({ days: 1 });
  const dateDebutA3 = dateDebutA2.plus({ years: 1 });
  const dateFinA3 = dateDebutA3.plus({ years: 1 }).minus({ days: 1 });
  const dateDebutA4 = dateDebutA3.plus({ years: 1 });

  const ageA1 = Math.floor(data.apprentiAge);
  const anniversaireA1 = apprentiDateNaissance.plus({ years: ageA1 + 1 });
  const ageA2 = ageA1 + 1;
  const anniversaireA2 = anniversaireA1.plus({ years: 1 });
  const ageA3 = ageA2 + 1;
  const anniversaireA3 = anniversaireA2.plus({ years: 1 });
  const ageA4 = ageA3 + 1;
  const anniversaireA4 = anniversaireA3.plus({ years: 1 });
  const ageA5 = ageA4 + 1;

  // console.table([
  //   { date: apprentiDateNaissance.toFormat("yyyy-MM-dd"), age: ageA1 },
  //   { date: anniversaireA1.toFormat("yyyy-MM-dd"), age: ageA2 },
  //   { date: anniversaireA2.toFormat("yyyy-MM-dd"), age: ageA3 },
  //   { date: anniversaireA3.toFormat("yyyy-MM-dd"), age: ageA4 },
  // ]);

  const smicObj = findSmicAtDate(dateDebutContrat);
  let SMIC = smicObj.mensuel;
  const departementEmployeur = data.employeurAdresseDepartement;
  let isSmicException = false;
  if (smicObj.exceptions && smicObj.exceptions[departementEmployeur]) {
    SMIC = smicObj.exceptions[departementEmployeur].mensuel;
    isSmicException = true;
  }

  const seuils = [17, 18, 21, 26];
  const getSeuils = (age) => {
    if (age <= seuils[0]) return 0;
    if (age >= seuils[1] && age < seuils[2]) return 1;
    if (age >= seuils[2] && age < seuils[3]) return 2;
    if (age >= seuils[3]) return 3;
  };

  const taux = {
    a1: {
      0: 27,
      1: 43,
      2: 53,
      3: 100,
    },
    a2: {
      0: 39,
      1: 51,
      2: 61,
      3: 100,
    },
    a3: {
      0: 55,
      1: 67,
      2: 78,
      3: 100,
    },
    a4: {
      0: 55,
      1: 67,
      2: 78,
      3: 100,
    },
  };

  const isChangingTaux = (currentAge, nextAge) => {
    return getSeuils(nextAge) > getSeuils(currentAge);
  };

  const shouldCapTaux = (part, seuil) => previous[part].taux.value < seuil;
  const keepPreviousTaux = (part) => previous[part].taux.value;
  const getTaux = (part, taux) => (shouldCapTaux(part, taux) ? taux : keepPreviousTaux(part));

  let finRemuneration = false;
  const emptyLineObj = {
    dateDebut: "",
    dateFin: "",
    taux: 0,
    tauxMinimal: 0,
    typeSalaire: "SMIC",
    salaireBrut: 0,
  };

  let result1 = {
    11: emptyLineObj,
    12: emptyLineObj,
  };
  if (isChangingTaux(ageA1, ageA2)) {
    const dateFin11 = anniversaireA1.minus({ days: anniversaireA1.toObject().day }).plus({ months: 1 });
    const dateDebut12 = dateFin11.plus({ days: 1 });
    const taux11 = taux.a1[getSeuils(ageA1)];
    const taux12 = taux.a1[getSeuils(ageA2)];

    if (dateFin11 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(11, taux11),
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: emptyLineObj,
      };
    } else if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFin11.toFormat("yyyy-MM-dd"),
          taux: getTaux(11, taux11),
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: {
          dateDebut: dateDebut12.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(12, taux12),
          tauxMinimal: taux12,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux12) / 100,
        },
      };
    } else {
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFin11.toFormat("yyyy-MM-dd"),
          taux: getTaux(11, taux11),
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: {
          dateDebut: dateDebut12.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA1.toFormat("yyyy-MM-dd"),
          taux: getTaux(12, taux12),
          tauxMinimal: taux12,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux12) / 100,
        },
      };
    }
  } else {
    const taux11 = taux.a1[getSeuils(ageA1)];
    if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(11, taux11),
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: emptyLineObj,
      };
    } else {
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA1.toFormat("yyyy-MM-dd"),
          taux: getTaux(11, taux11),
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux11) / 100,
        },
        12: emptyLineObj,
      };
    }
  }

  let result2 = {
    21: emptyLineObj,
    22: emptyLineObj,
  };
  if (isChangingTaux(ageA2, ageA3) && !finRemuneration) {
    const dateFin21 = anniversaireA2.minus({ days: anniversaireA2.toObject().day }).plus({ months: 1 });
    const dateDebut22 = dateFin21.plus({ days: 1 });
    const taux21 = taux.a2[getSeuils(ageA2)];
    const taux22 = taux.a2[getSeuils(ageA3)];

    if (dateFin21 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(21, taux21),
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: emptyLineObj,
      };
    } else if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFin21.toFormat("yyyy-MM-dd"),
          taux: getTaux(21, taux21),
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: {
          dateDebut: dateDebut22.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(22, taux22),
          tauxMinimal: taux22,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux22) / 100,
        },
      };
    } else {
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFin21.toFormat("yyyy-MM-dd"),
          taux: getTaux(21, taux21),
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: {
          dateDebut: dateDebut22.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA2.toFormat("yyyy-MM-dd"),
          taux: getTaux(22, taux22),
          tauxMinimal: taux22,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux22) / 100,
        },
      };
    }
  } else if (!finRemuneration) {
    const taux21 = taux.a2[getSeuils(ageA2)];

    if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(21, taux21),
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: emptyLineObj,
      };
    } else {
      result2 = {
        21: {
          dateDebut: dateDebutA2.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA2.toFormat("yyyy-MM-dd"),
          taux: getTaux(21, taux21),
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux21) / 100,
        },
        22: emptyLineObj,
      };
    }
  }

  let result3 = {
    31: emptyLineObj,
    32: emptyLineObj,
  };
  if (isChangingTaux(ageA3, ageA4) && !finRemuneration) {
    const dateFin31 = anniversaireA3.minus({ days: anniversaireA3.toObject().day }).plus({ months: 1 });
    const dateDebut32 = dateFin31.plus({ days: 1 });
    const taux31 = taux.a3[getSeuils(ageA3)];
    const taux32 = taux.a3[getSeuils(ageA4)];

    if (dateFin31 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(31, taux31),
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: emptyLineObj,
      };
    } else if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFin31.toFormat("yyyy-MM-dd"),
          taux: getTaux(31, taux31),
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: {
          dateDebut: dateDebut32.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(32, taux32),
          tauxMinimal: taux32,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux32) / 100,
        },
      };
    } else {
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFin31.toFormat("yyyy-MM-dd"),
          taux: getTaux(31, taux31),
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: {
          dateDebut: dateDebut32.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA3.toFormat("yyyy-MM-dd"),
          taux: getTaux(32, taux32),
          tauxMinimal: taux32,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux32) / 100,
        },
      };
    }
  } else if (!finRemuneration) {
    const taux31 = taux.a3[getSeuils(ageA3)];

    if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(31, taux31),
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: emptyLineObj,
      };
    } else {
      result3 = {
        31: {
          dateDebut: dateDebutA3.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA3.toFormat("yyyy-MM-dd"),
          taux: getTaux(31, taux31),
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux31) / 100,
        },
        32: emptyLineObj,
      };
    }
  }

  let result4 = {
    41: emptyLineObj,
    42: emptyLineObj,
  };
  if (isChangingTaux(ageA4, ageA5) && !finRemuneration) {
    const dateFin41 = anniversaireA4.minus({ days: anniversaireA4.toObject().day }).plus({ months: 1 });
    const dateDebut42 = dateFin41.plus({ days: 1 });
    const taux41 = taux.a4[getSeuils(ageA4)];
    const taux42 = taux.a4[getSeuils(ageA5)];

    if (dateFin41 >= dateFinContrat) {
      finRemuneration = true;
      result4 = {
        41: {
          dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(41, taux41),
          tauxMinimal: taux41,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux41) / 100,
        },
        42: emptyLineObj,
      };
    } else {
      result4 = {
        41: {
          dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
          dateFin: dateFin41.toFormat("yyyy-MM-dd"),
          taux: getTaux(41, taux41),
          tauxMinimal: taux41,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux41) / 100,
        },
        42: {
          dateDebut: dateDebut42.toFormat("yyyy-MM-dd"),
          dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
          taux: getTaux(42, taux42),
          tauxMinimal: taux42,
          typeSalaire: "SMIC",
          salaireBrut: (SMIC * taux42) / 100,
        },
      };
    }
  } else if (!finRemuneration) {
    const taux41 = taux.a4[getSeuils(ageA4)];
    result4 = {
      41: {
        dateDebut: dateDebutA4.toFormat("yyyy-MM-dd"),
        dateFin: dateFinContrat.toFormat("yyyy-MM-dd"),
        taux: getTaux(41, taux41),
        tauxMinimal: taux41,
        typeSalaire: "SMIC",
        salaireBrut: (SMIC * taux41) / 100,
      },
      42: emptyLineObj,
    };
  }

  const buildBlock = (part, result) => ({
    [part]: {
      dateDebut: {
        ...previous[part].dateDebut,
        value: result[part].dateDebut,
      },
      dateFin: {
        ...previous[part].dateFin,
        value: result[part].dateFin,
      },
      taux: {
        ...previous[part].taux,
        value: result[part].taux,
      },
      tauxMinimal: {
        ...previous[part].tauxMinimal,
        value: result[part].tauxMinimal,
      },
      typeSalaire: {
        ...previous[part].typeSalaire,
        value: result[part].typeSalaire,
      },
      salaireBrut: {
        ...previous[part].salaireBrut,
        value: result[part].salaireBrut,
      },
    },
  });

  const remunerationsAnnuelles = {
    ...buildBlock(11, result1),
    ...buildBlock(12, result1),

    ...buildBlock(21, result2),
    ...buildBlock(22, result2),

    ...buildBlock(31, result3),
    ...buildBlock(32, result3),

    ...buildBlock(41, result4),
    ...buildBlock(42, result4),
  };

  const { remunerationsAnnuellesDbValue, salaireEmbauche } = buildRemunerationsDbValue(remunerationsAnnuelles);

  return {
    remunerationsAnnuelles,
    remunerationsAnnuellesDbValue,
    salaireEmbauche,
    smicObj: {
      ...smicObj,
      isSmicException,
      selectedSmic: SMIC,
    },
  };
};

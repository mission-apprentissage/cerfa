import { DateTime } from "luxon";

const parseDate = (date) => DateTime.fromFormat(date, "D", { locale: "fr" }).setLocale("fr-FR");

const SMICs = {
  2022: {
    smics: [
      {
        annee: 2022,
        mensuel: 1645.58,
        horaire: 10.85,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.86,
        dateEntreeEnVigueur: "01/05/2022",
        dateEntreeEnVigueurObj: parseDate("01/05/2022"),
        dateParutionJo: "20/04/2022",
        dateParutionJoObj: parseDate("20/04/2022"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1242.15,
            horaire: 8.19,
            heuresHebdomadaires: 35,
          },
        },
      },
      {
        annee: 2022,
        mensuel: 1603.12,
        horaire: 10.57,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.76,
        dateEntreeEnVigueur: "01/01/2022",
        dateEntreeEnVigueurObj: parseDate("01/01/2022"),
        dateParutionJo: "22/12/2021",
        dateParutionJoObj: parseDate("22/12/2021"),
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
        dateEntreeEnVigueurObj: parseDate("01/10/2021"),
        dateParutionJo: "30/09/2021",
        dateParutionJoObj: parseDate("30/09/2021"),
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
        dateEntreeEnVigueurObj: parseDate("01/01/2021"),
        dateParutionJo: "17/12/2020",
        dateParutionJoObj: parseDate("17/12/2020"),
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
  2020: {
    smics: [
      {
        annee: 2020,
        mensuel: 1539.42,
        horaire: 10.15,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.65,
        dateEntreeEnVigueur: "01/01/2020",
        dateEntreeEnVigueurObj: parseDate("01/01/2020"),
        dateParutionJo: "19/12/2019",
        dateParutionJoObj: parseDate("19/12/2019"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1161.77,
            horaire: 7.66,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2019: {
    smics: [
      {
        annee: 2019,
        mensuel: 1521.22,
        horaire: 10.03,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.62,
        dateEntreeEnVigueur: "01/01/2019",
        dateEntreeEnVigueurObj: parseDate("01/01/2019"),
        dateParutionJo: "20/12/2018",
        dateParutionJoObj: parseDate("20/12/2018"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1148.12,
            horaire: 7.57,
            heuresHebdomadaires: 35,
          },
        },
      },
    ],
  },
  2018: {
    smics: [
      {
        annee: 2018,
        mensuel: 1498.47,
        horaire: 9.88,
        heuresHebdomadaires: 35,
        minimumGaranti: 3.57,
        dateEntreeEnVigueur: "01/01/2018",
        dateEntreeEnVigueurObj: parseDate("01/01/2018"),
        dateParutionJo: "21/12/2017",
        dateParutionJoObj: parseDate("21/12/2017"),
        exceptions: {
          976: {
            departement: 976,
            nomDepartement: "Mayotte",
            mensuel: 1131.43, //  1260.74
            horaire: 7.46,
            heuresHebdomadaires: 35, // 39
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

  return smicsArray.find((smicObj) => lookupDate >= smicObj.dateEntreeEnVigueurObj) ?? smicsArray[0];
};

const ceilUp = (x) => Math.ceil(x * 100) / 100;

export const buildRemuneration = (data) => {
  const selectedTaux = data.selectedTaux ?? {};
  const dateDebutContrat = DateTime.fromISO(data.dateDebutContrat).setLocale("fr-FR");
  const dateFinContrat = DateTime.fromISO(data.dateFinContrat).setLocale("fr-FR");
  const apprentiDateNaissance = DateTime.fromISO(data.apprentiDateNaissance).setLocale("fr-FR");
  const isAnniversaireInLastMonthContrat = dateFinContrat.get("month") === apprentiDateNaissance.get("month");
  const isAnniversaireMonthBeforeStartContrat =
    dateDebutContrat.get("month") === apprentiDateNaissance.get("month") + 1;

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

  // Kept for debug
  // console.log([
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

  const getTaux = (part, tauxValue) => Math.max(selectedTaux?.[part] ?? 0, tauxValue);

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
  const taux11 = taux.a1[getSeuils(ageA1)];
  const taux12 = taux.a1[getSeuils(ageA2)];
  const selectedTaux11 = getTaux(1.1, taux11);
  const selectedTaux12 = getTaux(1.2, taux12);
  if (
    isChangingTaux(ageA1, ageA2) &&
    !(isAnniversaireInLastMonthContrat && dateFinContrat.get("year") === dateFinA1.get("year"))
  ) {
    const dateDebut12 = anniversaireA1.set({ day: 1, month: anniversaireA1.get("month") + 1 });
    const dateFin11 = dateDebut12.minus({ days: 1 });

    if (dateFin11 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: emptyLineObj,
      };
    } else if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toISO(),
          dateFin: dateFin11.toISO(),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: {
          dateDebut: dateDebut12.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux12,
          tauxMinimal: taux12,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux12) / 100),
        },
      };
    } else {
      if (isAnniversaireMonthBeforeStartContrat) {
        result1 = {
          11: {
            dateDebut: dateDebutContrat.toISO(),
            dateFin: dateFin11.toISO(),
            taux: selectedTaux11,
            tauxMinimal: taux11,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
          },
          12: emptyLineObj,
        };
      } else {
        result1 = {
          11: {
            dateDebut: dateDebutContrat.toISO(),
            dateFin: dateFin11.toISO(),
            taux: selectedTaux11,
            tauxMinimal: taux11,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
          },
          12: {
            dateDebut: dateDebut12.toISO(),
            dateFin: dateFinA1.toISO(),
            taux: selectedTaux12,
            tauxMinimal: taux12,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux12) / 100),
          },
        };
      }
    }
  } else {
    if (dateFinA1 >= dateFinContrat) {
      finRemuneration = true;
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: emptyLineObj,
      };
    } else {
      result1 = {
        11: {
          dateDebut: dateDebutContrat.toFormat("yyyy-MM-dd"),
          dateFin: dateFinA1.toFormat("yyyy-MM-dd"),
          taux: selectedTaux11,
          tauxMinimal: taux11,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux11) / 100),
        },
        12: emptyLineObj,
      };
    }
  }

  let result2 = {
    21: emptyLineObj,
    22: emptyLineObj,
  };

  const taux21 = taux.a2[getSeuils(ageA2)];
  const taux22 = taux.a2[getSeuils(ageA3)];
  const selectedTaux21 = getTaux(2.1, taux21);
  const selectedTaux22 = getTaux(2.2, taux22);
  if (
    isChangingTaux(ageA2, ageA3) &&
    !finRemuneration &&
    !(isAnniversaireInLastMonthContrat && dateFinContrat.get("year") === dateFinA2.get("year"))
  ) {
    const dateDebut22 = anniversaireA2.set({ day: 1, month: anniversaireA2.get("month") + 1 });
    const dateFin21 = dateDebut22.minus({ days: 1 });

    if (dateFin21 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: emptyLineObj,
      };
    } else if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toISO(),
          dateFin: dateFin21.toISO(),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: {
          dateDebut: dateDebut22.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux22,
          tauxMinimal: taux22,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux22) / 100),
        },
      };
    } else {
      if (isAnniversaireMonthBeforeStartContrat) {
        result2 = {
          21: {
            dateDebut: dateDebutA2.toISO(),
            dateFin: dateFin21.toISO(),
            taux: selectedTaux21,
            tauxMinimal: taux21,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
          },
          22: emptyLineObj,
        };
      } else {
        result2 = {
          21: {
            dateDebut: dateDebutA2.toISO(),
            dateFin: dateFin21.toISO(),
            taux: selectedTaux21,
            tauxMinimal: taux21,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
          },
          22: {
            dateDebut: dateDebut22.toISO(),
            dateFin: dateFinA2.toISO(),
            taux: selectedTaux22,
            tauxMinimal: taux22,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux22) / 100),
          },
        };
      }
    }
  } else if (!finRemuneration) {
    if (dateFinA2 >= dateFinContrat) {
      finRemuneration = true;
      result2 = {
        21: {
          dateDebut: dateDebutA2.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: emptyLineObj,
      };
    } else {
      result2 = {
        21: {
          dateDebut: dateDebutA2.toISO(),
          dateFin: dateFinA2.toISO(),
          taux: selectedTaux21,
          tauxMinimal: taux21,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux21) / 100),
        },
        22: emptyLineObj,
      };
    }
  }

  let result3 = {
    31: emptyLineObj,
    32: emptyLineObj,
  };
  const taux31 = taux.a3[getSeuils(ageA3)];
  const taux32 = taux.a3[getSeuils(ageA4)];
  const selectedTaux31 = getTaux(3.1, taux31);
  const selectedTaux32 = getTaux(3.2, taux32);
  if (
    isChangingTaux(ageA3, ageA4) &&
    !finRemuneration &&
    !(isAnniversaireInLastMonthContrat && dateFinContrat.get("year") === dateFinA3.get("year"))
  ) {
    const dateDebut32 = anniversaireA3.set({ day: 1, month: anniversaireA3.get("month") + 1 });
    const dateFin31 = dateDebut32.minus({ days: 1 });

    if (dateFin31 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: emptyLineObj,
      };
    } else if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toISO(),
          dateFin: dateFin31.toISO(),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: {
          dateDebut: dateDebut32.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux32,
          tauxMinimal: taux32,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux32) / 100),
        },
      };
    } else {
      if (isAnniversaireMonthBeforeStartContrat) {
        result3 = {
          31: {
            dateDebut: dateDebutA3.toISO(),
            dateFin: dateFin31.toISO(),
            taux: selectedTaux31,
            tauxMinimal: taux31,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
          },
          32: emptyLineObj,
        };
      } else {
        result3 = {
          31: {
            dateDebut: dateDebutA3.toISO(),
            dateFin: dateFin31.toISO(),
            taux: selectedTaux31,
            tauxMinimal: taux31,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
          },
          32: {
            dateDebut: dateDebut32.toISO(),
            dateFin: dateFinA3.toISO(),
            taux: selectedTaux32,
            tauxMinimal: taux32,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux32) / 100),
          },
        };
      }
    }
  } else if (!finRemuneration) {
    if (dateFinA3 >= dateFinContrat) {
      finRemuneration = true;
      result3 = {
        31: {
          dateDebut: dateDebutA3.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: emptyLineObj,
      };
    } else {
      result3 = {
        31: {
          dateDebut: dateDebutA3.toISO(),
          dateFin: dateFinA3.toISO(),
          taux: selectedTaux31,
          tauxMinimal: taux31,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux31) / 100),
        },
        32: emptyLineObj,
      };
    }
  }

  let result4 = {
    41: emptyLineObj,
    42: emptyLineObj,
  };
  const taux41 = taux.a4[getSeuils(ageA4)];
  const taux42 = taux.a4[getSeuils(ageA5)];
  const selectedTaux41 = getTaux(4.1, taux41);
  const selectedTaux42 = getTaux(4.2, taux42);

  if (isChangingTaux(ageA4, ageA5) && !finRemuneration && !isAnniversaireInLastMonthContrat) {
    const dateDebut42 = anniversaireA4.set({ day: 1, month: anniversaireA4.get("month") + 1 });
    const dateFin41 = dateDebut42.minus({ days: 1 });

    if (dateFin41 >= dateFinContrat) {
      finRemuneration = true;
      result4 = {
        41: {
          dateDebut: dateDebutA4.toISO(),
          dateFin: dateFinContrat.toISO(),
          taux: selectedTaux41,
          tauxMinimal: taux41,
          typeSalaire: "SMIC",
          salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
        },
        42: emptyLineObj,
      };
    } else {
      if (isAnniversaireMonthBeforeStartContrat) {
        result4 = {
          41: {
            dateDebut: dateDebutA4.toISO(),
            dateFin: dateFin41.toISO(),
            taux: selectedTaux41,
            tauxMinimal: taux41,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
          },
          42: emptyLineObj,
        };
      } else {
        result4 = {
          41: {
            dateDebut: dateDebutA4.toISO(),
            dateFin: dateFin41.toISO(),
            taux: selectedTaux41,
            tauxMinimal: taux41,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
          },
          42: {
            dateDebut: dateDebut42.toISO(),
            dateFin: dateFinContrat.toISO(),
            taux: selectedTaux42,
            tauxMinimal: taux42,
            typeSalaire: "SMIC",
            salaireBrut: ceilUp((SMIC * selectedTaux42) / 100),
          },
        };
      }
    }
  } else if (!finRemuneration) {
    result4 = {
      41: {
        dateDebut: dateDebutA4.toISO(),
        dateFin: dateFinContrat.toISO(),
        taux: selectedTaux41,
        tauxMinimal: taux41,
        typeSalaire: "SMIC",
        salaireBrut: ceilUp((SMIC * selectedTaux41) / 100),
      },
      42: emptyLineObj,
    };
  }

  const buildBlock2 = (part, result) =>
    result[part].taux
      ? {
          dateDebut: result[part].dateDebut,
          dateFin: result[part].dateFin,
          taux: result[part].taux,
          tauxMinimal: result[part].tauxMinimal,
          typeSalaire: result[part].typeSalaire,
          salaireBrut: ceilUp(result[part].salaireBrut),
          ordre: `${part.toString()[0]}.${part.toString()[1]}`,
        }
      : undefined;

  const remunerationsAnnuelles = [
    buildBlock2(11, result1),
    buildBlock2(12, result1),
    buildBlock2(21, result2),
    buildBlock2(22, result2),
    buildBlock2(31, result3),
    buildBlock2(32, result3),
    buildBlock2(41, result4),
    buildBlock2(42, result4),
  ].filter((item) => item);

  return {
    remunerationsAnnuelles,
    salaireEmbauche: remunerationsAnnuelles[0].salaireBrut,
    smicObj: {
      ...smicObj,
      isSmicException,
      selectedSmic: SMIC,
    },
  };
};

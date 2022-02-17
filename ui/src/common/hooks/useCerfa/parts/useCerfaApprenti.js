/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  fieldCompletionPercentage,
  convertValueToDate,
  convertDateToValue,
  convertValueToMultipleSelectOption,
  convertMultipleSelectOptionToValue,
  convertOptionToValue,
  convertValueToOption,
  caclAgeAtDate,
  normalizeInputNumberForDb,
  doAsyncCodePostalActions,
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import * as apprentiAtoms from "./useCerfaApprentiAtoms";
import { buildRemunerations } from "../../../utils/form/remunerationsUtils";
import { fieldsChecker } from "../../../utils/form/fieldsCheckUtils";
import { useCerfaContrat } from "../parts/useCerfaContrat";
import { DateTime } from "luxon";

export const cerfaApprentiCompletion = (res) => {
  let fieldsToKeep = {
    apprentiNom: res.apprenti.nom,
    apprentiPrenom: res.apprenti.prenom,
    apprentiSexe: res.apprenti.sexe,
    apprentiNationalite: res.apprenti.nationalite,
    apprentiDateNaissance: res.apprenti.dateNaissance,
    apprentiDepartementNaissance: res.apprenti.departementNaissance,
    apprentiCommuneNaissance: res.apprenti.communeNaissance,
    // apprentiNir: res.apprenti.nir,
    apprentiRegimeSocial: res.apprenti.regimeSocial,
    apprentiHandicap: res.apprenti.handicap,
    apprentiSituationAvantContrat: res.apprenti.situationAvantContrat,
    apprentiDiplome: res.apprenti.diplome,
    apprentiDerniereClasse: res.apprenti.derniereClasse,
    apprentiDiplomePrepare: res.apprenti.diplomePrepare,
    apprentiIntituleDiplomePrepare: res.apprenti.intituleDiplomePrepare,
    apprentiTelephone: res.apprenti.telephone,
    apprentiCourriel: res.apprenti.courriel,
    // apprentiAdresseNumero: res.apprenti.adresse.numero,
    apprentiAdresseVoie: res.apprenti.adresse.voie,
    // apprentiAdresseComplement: res.apprenti.adresse.complement,
    apprentiAdresseCodePostal: res.apprenti.adresse.codePostal,
    apprentiAdresseCommune: res.apprenti.adresse.commune,
    apprentiInscriptionSportifDeHautNiveau: res.apprenti.inscriptionSportifDeHautNiveau,
  };
  let countFields = 20;
  // const ageApprenti = !res.apprenti.age.value || res.apprenti.age.value === "" ? 18 : res.apprenti.age.value;
  // const majeur = ageApprenti >= 18;
  const nonEmancipe = res.apprenti.apprentiMineurNonEmancipe.value;
  const apprentiResponsableLegalMemeAdresse = res.apprenti.responsableLegal.memeAdresse.value;

  // if (!majeur) {
  fieldsToKeep = {
    ...fieldsToKeep,
    apprentiApprentiMineur: res.apprenti.apprentiMineur,
    apprentiApprentiMineurNonEmancipe: res.apprenti.apprentiMineurNonEmancipe,
  };
  countFields = countFields + 2;
  if (nonEmancipe) {
    fieldsToKeep = {
      ...fieldsToKeep,
      apprentiResponsableLegalNom: res.apprenti.responsableLegal.nom,
      apprentiResponsableLegalPrenom: res.apprenti.responsableLegal.prenom,
      apprentiResponsableLegalMemeAdresse: res.apprenti.responsableLegal.memeAdresse,
    };
    countFields = countFields + 3;
    if (!apprentiResponsableLegalMemeAdresse) {
      fieldsToKeep = {
        ...fieldsToKeep,
        // apprentiResponsableLegalAdresseNumero: res.apprenti.responsableLegal.adresse.numero,
        apprentiResponsableLegalAdresseVoie: res.apprenti.responsableLegal.adresse.voie,
        // apprentiResponsableLegalAdresseComplement: res.apprenti.responsableLegal.adresse.complement,
        apprentiResponsableLegalAdresseCodePostal: res.apprenti.responsableLegal.adresse.codePostal,
        apprentiResponsableLegalAdresseCommune: res.apprenti.responsableLegal.adresse.commune,
      };
      countFields = countFields + 3;
    }
  }
  // }

  return fieldCompletionPercentage(fieldsToKeep, countFields);
};

export const CerfaApprentiController = async (dossier) => {
  return {
    apprenti: {
      dateNaissance: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const dateNaissance = DateTime.fromISO(value).setLocale("fr-FR");
          const today = DateTime.now().setLocale("fr-FR");
          let age = null;

          if (dateNaissance > today) {
            return {
              successed: false,
              data: null,
              message: "La date de naissance de peut pas être dans le futur",
            };
          }

          if (data.dateDebutContrat !== "") {
            const cAge = caclAgeAtDate(value, data.dateDebutContrat);
            age = cAge.age;

            if (age < 15) {
              return {
                successed: false,
                data: null,
                message: "L'apprenti(e) doit avoir au moins 15 ans à la date de début d'exécution du contrat",
              };
            }

            if (data.dateFinContrat !== "" && data.employeurAdresseDepartement !== "") {
              const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue, smicObj } =
                buildRemunerations({
                  apprentiDateNaissance: value,
                  apprentiAge: age,
                  dateDebutContrat: data.dateDebutContrat,
                  dateFinContrat: data.dateFinContrat,
                  remunerationsAnnuelles: data.remunerationsAnnuelles,
                  employeurAdresseDepartement: data.employeurAdresseDepartement,
                });

              return {
                successed: true,
                data: {
                  dateNaissance: value,
                  age,
                  remunerationsAnnuelles,
                  remunerationsAnnuellesDbValue,
                  smicObj,
                  salaireEmbauche,
                  dateDebutContrat: data.dateDebutContrat,
                  apprentiApprentiMineur: data.apprentiApprentiMineur,
                },
                message: null,
              };
            }
          }

          return {
            successed: true,
            data: {
              dateNaissance: value,
              age,
              dateDebutContrat: data.dateDebutContrat,
              apprentiApprentiMineur: data.apprentiApprentiMineur,
            },
            message: null,
          };
        },
      },
      adresse: {
        codePostal: {
          doAsyncActions: async (value, data) => {
            return await doAsyncCodePostalActions(value, data, dossier._id);
          },
        },
      },
      responsableLegal: {
        adresse: {
          codePostal: {
            doAsyncActions: async (value, data) => {
              return await doAsyncCodePostalActions(value, data, dossier._id);
            },
          },
        },
      },
    },
  };
};

export function useCerfaApprenti() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);
  const { setRemunerations, refreshTypeDerogation } = useCerfaContrat();

  const [partApprentiCompletion, setPartApprentiCompletion] = useRecoilState(
    apprentiAtoms.cerfaPartApprentiCompletionAtom
  );
  const [isLoading, setIsLoading] = useRecoilState(apprentiAtoms.cerfaPartApprentiIsLoadingAtom);

  const [isValidating, setIsValidating] = useRecoilState(apprentiAtoms.cerfaPartApprentiIsValidatigngAtom);
  const resetCheckFields = useRecoilState(apprentiAtoms.cerfaPartApprentiHasBeenResetAtom);
  const [fieldsErrored, setFieldsErrored] = useRecoilState(apprentiAtoms.cerfaPartApprentiFieldsErroredAtom);
  const [fieldsValided, setFieldsValided] = useRecoilState(apprentiAtoms.cerfaPartApprentiFieldsVaidedAtom);

  const [apprentiNom, setApprentiNom] = useRecoilState(apprentiAtoms.cerfaApprentiNomAtom);
  const [apprentiPrenom, setApprentiPrenom] = useRecoilState(apprentiAtoms.cerfaApprentiPrenomAtom);
  const [apprentiSexe, setApprentiSexe] = useRecoilState(apprentiAtoms.cerfaApprentiSexeAtom);
  const [apprentiNationalite, setApprentiNationalite] = useRecoilState(apprentiAtoms.cerfaApprentiNationaliteAtom);
  const [apprentiDateNaissance, setApprentiDateNaissance] = useRecoilState(
    apprentiAtoms.cerfaApprentiDateNaissanceAtom
  );
  const [apprentiAge, setApprentiAge] = useRecoilState(apprentiAtoms.cerfaApprentiAgeAtom);
  const [apprentiDepartementNaissance, setApprentiDepartementNaissance] = useRecoilState(
    apprentiAtoms.cerfaApprentiDepartementNaissanceAtom
  );
  const [apprentiCommuneNaissance, setApprentiCommuneNaissance] = useRecoilState(
    apprentiAtoms.cerfaApprentiCommuneNaissanceAtom
  );
  const [apprentiNir, setApprentiNir] = useRecoilState(apprentiAtoms.cerfaApprentiNirAtom);
  const [apprentiRegimeSocial, setApprentiRegimeSocial] = useRecoilState(apprentiAtoms.cerfaApprentiRegimeSocialAtom);
  const [apprentiHandicap, setApprentiHandicap] = useRecoilState(apprentiAtoms.cerfaApprentiHandicapAtom);
  const [apprentiSituationAvantContrat, setApprentiSituationAvantContrat] = useRecoilState(
    apprentiAtoms.cerfaApprentiSituationAvantContratAtom
  );
  const [apprentiDiplome, setApprentiDiplome] = useRecoilState(apprentiAtoms.cerfaApprentiDiplomeAtom);
  const [apprentiDerniereClasse, setApprentiDerniereClasse] = useRecoilState(
    apprentiAtoms.cerfaApprentiDerniereClasseAtom
  );
  const [apprentiDiplomePrepare, setApprentiDiplomePrepare] = useRecoilState(
    apprentiAtoms.cerfaApprentiDiplomePrepareAtom
  );
  const [apprentiIntituleDiplomePrepare, setApprentiIntituleDiplomePrepare] = useRecoilState(
    apprentiAtoms.cerfaApprentiIntituleDiplomePrepareAtom
  );
  const [apprentiTelephone, setApprentiTelephone] = useRecoilState(apprentiAtoms.cerfaApprentiTelephoneAtom);
  const [apprentiCourriel, setApprentiCourriel] = useRecoilState(apprentiAtoms.cerfaApprentiCourrielAtom);
  const [apprentiAdresseNumero, setApprentiAdresseNumero] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseNumeroAtom
  );
  const [apprentiAdresseVoie, setApprentiAdresseVoie] = useRecoilState(apprentiAtoms.cerfaApprentiAdresseVoieAtom);
  const [apprentiAdresseComplement, setApprentiAdresseComplement] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseComplementAtom
  );
  const [apprentiAdresseCodePostal, setApprentiAdresseCodePostal] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseCodePostalAtom
  );
  const [apprentiAdresseCommune, setApprentiAdresseCommune] = useRecoilState(
    apprentiAtoms.cerfaApprentiAdresseCommuneAtom
  );
  const [apprentiAdressePays, setApprentiAdressePays] = useRecoilState(apprentiAtoms.cerfaApprentiAdressePaysAtom);

  const [apprentiApprentiMineur, setApprentiApprentiMineur] = useRecoilState(
    apprentiAtoms.cerfaApprentiapprentiMineurAtom
  );
  const [apprentiApprentiMineurNonEmancipe, setApprentiApprentiMineurNonEmancipe] = useRecoilState(
    apprentiAtoms.cerfaApprentiApprentiMineurNonEmancipeAtom
  );
  const [apprentiResponsableLegalNom, setApprentiResponsableLegalNom] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalNomAtom
  );
  const [apprentiResponsableLegalPrenom, setApprentiResponsableLegalPrenom] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalPrenomAtom
  );
  const [apprentiResponsableLegalMemeAdresse, setApprentiResponsableLegalMemeAdresse] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalMemeAdresseAtom
  );
  const [apprentiResponsableLegalAdresseNumero, setApprentiResponsableLegalAdresseNumero] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseNumeroAtom
  );
  const [apprentiResponsableLegalAdresseVoie, setApprentiResponsableLegalAdresseVoie] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseVoieAtom
  );
  const [apprentiResponsableLegalAdresseComplement, setApprentiResponsableLegalAdresseComplement] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseComplementAtom
  );
  const [apprentiResponsableLegalAdresseCodePostal, setApprentiResponsableLegalAdresseCodePostal] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseCodePostalAtom
  );
  const [apprentiResponsableLegalAdresseCommune, setApprentiResponsableLegalAdresseCommune] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdresseCommuneAtom
  );

  const [apprentiResponsableLegalAdressePays, setApprentiResponsableLegalAdressePays] = useRecoilState(
    apprentiAtoms.cerfaApprentiResponsableLegalAdressePaysAtom
  );
  const [apprentiInscriptionSportifDeHautNiveau, setApprentiInscriptionSportifDeHautNiveau] = useRecoilState(
    apprentiAtoms.cerfaApprentiInscriptionSportifDeHautNiveauAtom
  );

  const resetInDbResponsableLegalData = useCallback(
    async (prevDataToSave, reset, skipKey, majeur) => {
      let dataToSave = prevDataToSave;
      if (reset) {
        dataToSave = {
          ...dataToSave,
          apprenti: {
            ...dataToSave.apprenti,
            apprentiMineurNonEmancipe:
              skipKey === "apprentiMineurNonEmancipe"
                ? dataToSave.apprenti.apprentiMineurNonEmancipe
                : majeur
                ? false
                : null,
            responsableLegal: {
              nom: null,
              prenom: null,
              memeAdresse: null,
              adresse: {
                numero: null,
                voie: null,
                complement: null,
                codePostal: null,
                commune: null,
                pays: null,
              },
            },
          },
        };
      } else {
        dataToSave = {
          ...dataToSave,
          apprenti: {
            ...dataToSave.apprenti,
            apprentiMineurNonEmancipe:
              skipKey === "apprentiMineurNonEmancipe"
                ? dataToSave.apprenti.apprentiMineurNonEmancipe
                : convertOptionToValue(apprentiApprentiMineurNonEmancipe),
            responsableLegal: {
              nom: apprentiResponsableLegalNom?.value || null,
              prenom: apprentiResponsableLegalPrenom?.value || null,
              memeAdresse: convertOptionToValue(apprentiResponsableLegalMemeAdresse),
              adresse: {
                numero: normalizeInputNumberForDb(apprentiResponsableLegalAdresseNumero?.value),
                voie: apprentiResponsableLegalAdresseVoie?.value || null,
                complement: apprentiResponsableLegalAdresseComplement?.value || null,
                codePostal: apprentiResponsableLegalAdresseCodePostal?.value || null,
                commune: apprentiResponsableLegalAdresseCommune?.value || null,
                pays: convertOptionToValue(apprentiResponsableLegalAdressePays) || null,
              },
            },
          },
        };
      }

      return dataToSave;
    },
    [
      apprentiApprentiMineurNonEmancipe,
      apprentiResponsableLegalNom?.value,
      apprentiResponsableLegalPrenom?.value,
      apprentiResponsableLegalMemeAdresse,
      apprentiResponsableLegalAdresseNumero?.value,
      apprentiResponsableLegalAdresseVoie?.value,
      apprentiResponsableLegalAdresseComplement?.value,
      apprentiResponsableLegalAdresseCodePostal?.value,
      apprentiResponsableLegalAdresseCommune?.value,
      apprentiResponsableLegalAdressePays,
    ]
  );

  const onSubmittedApprentiNom = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.nom") {
          const newV = {
            apprenti: {
              nom: {
                ...apprentiNom,
                value: data,
              },
            },
          };
          if (apprentiNom.value !== newV.apprenti.nom.value) {
            setApprentiNom(newV.apprenti.nom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                nom: newV.apprenti.nom.value,
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiNom, setApprentiNom, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiPrenom = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.prenom") {
          const newV = {
            apprenti: {
              prenom: {
                ...apprentiPrenom,
                value: data,
              },
            },
          };
          if (apprentiPrenom.value !== newV.apprenti.prenom.value) {
            setApprentiPrenom(newV.apprenti.prenom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                prenom: newV.apprenti.prenom.value,
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiPrenom, setApprentiPrenom, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiDateNaissance = useCallback(
    async (path, data, forcedTriggered) => {
      try {
        if (path === "apprenti.dateNaissance") {
          const newV = {
            apprenti: {
              dateNaissance: {
                ...apprentiDateNaissance,
                value: data.dateNaissance,
              },
              age: {
                ...apprentiAge,
                value: data.age,
              },
            },
          };
          let shouldSaveInDb = false;
          let dataToSave = null;
          if (!forcedTriggered) {
            if (apprentiDateNaissance.value !== newV.apprenti.dateNaissance.value) {
              setApprentiDateNaissance(newV.apprenti.dateNaissance);
              setApprentiAge(newV.apprenti.age);

              dataToSave = {
                apprenti: {
                  dateNaissance: convertDateToValue(newV.apprenti.dateNaissance),
                  age: newV.apprenti.age.value,
                },
              };
              shouldSaveInDb = true;

              refreshTypeDerogation({
                dateNaissance: data.dateNaissance,
                age: newV.apprenti.age.value,
                contratDateDebutContratString: data.dateDebutContrat,
              });
            }
          } else {
            dataToSave = {
              apprenti: {
                dateNaissance: convertDateToValue(newV.apprenti.dateNaissance),
                age: apprentiAge.value,
              },
            };
            setApprentiDateNaissance({ ...apprentiDateNaissance, triggerValidation: false });
            shouldSaveInDb = true;
          }

          if (shouldSaveInDb) {
            if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
              setRemunerations(data);
              dataToSave = {
                ...dataToSave,
                contrat: {
                  remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                  salaireEmbauche: data.salaireEmbauche.toFixed(2),
                  smic: data.smicObj,
                },
              };
            }

            dataToSave = await resetInDbResponsableLegalData(
              dataToSave,
              !apprentiApprentiMineur,
              null,
              !apprentiApprentiMineur
            );

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiDateNaissance,
      apprentiAge,
      setApprentiDateNaissance,
      setApprentiAge,
      refreshTypeDerogation,
      resetInDbResponsableLegalData,
      apprentiApprentiMineur,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
      setRemunerations,
    ]
  );

  const onSubmittedApprentiAdresseNumero = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.adresse.numero") {
          const newV = {
            apprenti: {
              adresse: {
                numero: {
                  ...apprentiAdresseNumero,
                  value: data,
                },
              },
            },
          };
          if (apprentiAdresseNumero.value !== newV.apprenti.adresse.numero.value) {
            setApprentiAdresseNumero(newV.apprenti.adresse.numero);

            let dataToSave = {
              apprenti: {
                adresse: {
                  numero: normalizeInputNumberForDb(data),
                },
              },
            };

            if (convertOptionToValue(apprentiResponsableLegalMemeAdresse)) {
              dataToSave = {
                apprenti: {
                  ...dataToSave.apprenti,
                  responsableLegal: {
                    adresse: {
                      numero: normalizeInputNumberForDb(data),
                    },
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);

            setPartApprentiCompletion(cerfaApprentiCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiAdresseNumero,
      setApprentiAdresseNumero,
      apprentiResponsableLegalMemeAdresse,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
    ]
  );

  const onSubmittedApprentiAdresseVoie = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.adresse.voie") {
          const newV = {
            apprenti: {
              adresse: {
                voie: {
                  ...apprentiAdresseVoie,
                  value: data,
                },
              },
            },
          };
          if (apprentiAdresseVoie.value !== newV.apprenti.adresse.voie.value) {
            setApprentiAdresseVoie(newV.apprenti.adresse.voie);

            let dataToSave = {
              apprenti: {
                adresse: {
                  voie: newV.apprenti.adresse.voie.value,
                },
              },
            };

            if (convertOptionToValue(apprentiResponsableLegalMemeAdresse)) {
              dataToSave = {
                apprenti: {
                  ...dataToSave.apprenti,
                  responsableLegal: {
                    adresse: {
                      voie: newV.apprenti.adresse.voie.value || null,
                    },
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiAdresseVoie,
      setApprentiAdresseVoie,
      apprentiResponsableLegalMemeAdresse,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiAdresseComplement = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.adresse.complement") {
          const newV = {
            apprenti: {
              adresse: {
                complement: {
                  ...apprentiAdresseComplement,
                  value: data,
                },
              },
            },
          };
          if (apprentiAdresseComplement.value !== newV.apprenti.adresse.complement.value) {
            setApprentiAdresseComplement(newV.apprenti.adresse.complement);

            let dataToSave = {
              apprenti: {
                adresse: {
                  complement: newV.apprenti.adresse.complement.value,
                },
              },
            };

            if (convertOptionToValue(apprentiResponsableLegalMemeAdresse)) {
              dataToSave = {
                apprenti: {
                  ...dataToSave.apprenti,
                  responsableLegal: {
                    adresse: {
                      complement: newV.apprenti.adresse.complement.value,
                    },
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiAdresseComplement,
      setApprentiAdresseComplement,
      apprentiResponsableLegalMemeAdresse,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
    ]
  );

  const onSubmittedApprentiAdresseCodePostal = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.adresse.codePostal") {
          const newV = {
            apprenti: {
              adresse: {
                codePostal: {
                  ...apprentiAdresseCodePostal,
                  value: data.codePostal,
                },
                commune: {
                  ...apprentiAdresseCommune,
                  value: data.commune,
                },
              },
            },
          };
          if (apprentiAdresseCodePostal.value !== newV.apprenti.adresse.codePostal.value) {
            setApprentiAdresseCodePostal(newV.apprenti.adresse.codePostal);
            setApprentiAdresseCommune(newV.apprenti.adresse.commune);

            let dataToSave = {
              apprenti: {
                adresse: {
                  codePostal: newV.apprenti.adresse.codePostal.value,
                  commune: newV.apprenti.adresse.commune.value,
                },
              },
            };

            if (convertOptionToValue(apprentiResponsableLegalMemeAdresse)) {
              dataToSave = {
                apprenti: {
                  ...dataToSave.apprenti,
                  responsableLegal: {
                    adresse: {
                      codePostal: newV.apprenti.adresse.codePostal.value,
                      commune: newV.apprenti.adresse.commune.value,
                    },
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "apprenti.adresse.commune"));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiAdresseCodePostal,
      apprentiAdresseCommune,
      setApprentiAdresseCodePostal,
      setApprentiAdresseCommune,
      apprentiResponsableLegalMemeAdresse,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiAdresseCommune = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.adresse.commune") {
          const newV = {
            apprenti: {
              adresse: {
                commune: {
                  ...apprentiAdresseCommune,
                  value: data,
                },
              },
            },
          };
          if (apprentiAdresseCommune.value !== newV.apprenti.adresse.commune.value) {
            setApprentiAdresseCommune(newV.apprenti.adresse.commune);

            let dataToSave = {
              apprenti: {
                adresse: {
                  commune: newV.apprenti.adresse.commune.value,
                },
              },
            };
            if (convertOptionToValue(apprentiResponsableLegalMemeAdresse)) {
              dataToSave = {
                apprenti: {
                  ...dataToSave.apprenti,
                  responsableLegal: {
                    adresse: {
                      commune: newV.apprenti.adresse.commune.value,
                    },
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiAdresseCommune,
      setApprentiAdresseCommune,
      apprentiResponsableLegalMemeAdresse,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiAdressePays = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.adresse.pays") {
          const newV = {
            apprenti: {
              adresse: {
                pays: {
                  ...apprentiAdressePays,
                  value: data,
                },
              },
            },
          };
          if (apprentiAdressePays.value !== newV.apprenti.adresse.pays.value) {
            setApprentiAdressePays(newV.apprenti.adresse.pays);

            let dataToSave = {
              apprenti: {
                adresse: {
                  pays: convertOptionToValue(newV.apprenti.adresse.pays),
                },
              },
            };

            if (convertOptionToValue(apprentiResponsableLegalMemeAdresse)) {
              dataToSave = {
                apprenti: {
                  ...dataToSave.apprenti,
                  responsableLegal: {
                    adresse: {
                      pays: convertOptionToValue(newV.apprenti.adresse.pays),
                    },
                  },
                },
              };
            }

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiAdressePays,
      setApprentiAdressePays,
      apprentiResponsableLegalMemeAdresse,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiTelephone = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.telephone") {
          const newV = {
            apprenti: {
              telephone: {
                ...apprentiTelephone,
                value: data || "",
              },
            },
          };
          if (apprentiTelephone.value !== newV.apprenti.telephone.value) {
            setApprentiTelephone(newV.apprenti.telephone);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                telephone: newV.apprenti.telephone.value !== "" ? `+${newV.apprenti.telephone.value}` : null,
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiTelephone, setApprentiTelephone, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiCourriel = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.courriel") {
          const newV = {
            apprenti: {
              courriel: {
                ...apprentiCourriel,
                value: data,
              },
            },
          };
          if (apprentiCourriel.value !== newV.apprenti.courriel.value) {
            setApprentiCourriel(newV.apprenti.courriel);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                courriel: newV.apprenti.courriel.value,
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiCourriel, setApprentiCourriel, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiDepartementNaissance = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.departementNaissance") {
          const newV = {
            apprenti: {
              departementNaissance: {
                ...apprentiDepartementNaissance,
                value: data,
              },
            },
          };
          if (apprentiDepartementNaissance.value !== newV.apprenti.departementNaissance.value) {
            setApprentiDepartementNaissance(newV.apprenti.departementNaissance);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                departementNaissance: newV.apprenti.departementNaissance.value,
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiDepartementNaissance,
      setApprentiDepartementNaissance,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiCommuneNaissance = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.communeNaissance") {
          const newV = {
            apprenti: {
              communeNaissance: {
                ...apprentiCommuneNaissance,
                value: data,
              },
            },
          };
          if (apprentiCommuneNaissance.value !== newV.apprenti.communeNaissance.value) {
            setApprentiCommuneNaissance(newV.apprenti.communeNaissance);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                communeNaissance: newV.apprenti.communeNaissance.value,
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiCommuneNaissance,
      setApprentiCommuneNaissance,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiDiplome = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.diplome") {
          const newV = {
            apprenti: {
              diplome: {
                ...apprentiDiplome,
                value: data,
              },
            },
          };
          if (apprentiDiplome.value !== newV.apprenti.diplome.value) {
            setApprentiDiplome(newV.apprenti.diplome);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                diplome: convertMultipleSelectOptionToValue(newV.apprenti.diplome),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiDiplome, setApprentiDiplome, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiDiplomePrepare = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.diplomePrepare") {
          const newV = {
            apprenti: {
              diplomePrepare: {
                ...apprentiDiplomePrepare,
                value: data,
              },
            },
          };
          if (apprentiDiplomePrepare.value !== newV.apprenti.diplomePrepare.value) {
            setApprentiDiplomePrepare(newV.apprenti.diplomePrepare);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                diplomePrepare: convertMultipleSelectOptionToValue(newV.apprenti.diplomePrepare),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiDiplomePrepare,
      setApprentiDiplomePrepare,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiSituationAvantContrat = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.situationAvantContrat") {
          const newV = {
            apprenti: {
              situationAvantContrat: {
                ...apprentiSituationAvantContrat,
                value: data,
              },
            },
          };
          if (apprentiSituationAvantContrat.value !== newV.apprenti.situationAvantContrat.value) {
            setApprentiSituationAvantContrat(newV.apprenti.situationAvantContrat);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                situationAvantContrat: convertOptionToValue(newV.apprenti.situationAvantContrat),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiSituationAvantContrat,
      setApprentiSituationAvantContrat,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiSexe = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.sexe") {
          const newV = {
            apprenti: {
              sexe: {
                ...apprentiSexe,
                value: data,
              },
            },
          };
          if (apprentiSexe.value !== newV.apprenti.sexe.value) {
            setApprentiSexe(newV.apprenti.sexe);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                sexe: convertOptionToValue(newV.apprenti.sexe),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiSexe, setApprentiSexe, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiNationalite = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.nationalite") {
          const newV = {
            apprenti: {
              nationalite: {
                ...apprentiNationalite,
                value: data,
              },
            },
          };
          if (apprentiNationalite.value !== newV.apprenti.nationalite.value) {
            setApprentiNationalite(newV.apprenti.nationalite);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                nationalite: convertOptionToValue(newV.apprenti.nationalite),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiNationalite, setApprentiNationalite, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiRegimeSocial = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.regimeSocial") {
          const newV = {
            apprenti: {
              regimeSocial: {
                ...apprentiRegimeSocial,
                value: data,
              },
            },
          };
          if (apprentiRegimeSocial.value !== newV.apprenti.regimeSocial.value) {
            setApprentiRegimeSocial(newV.apprenti.regimeSocial);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                regimeSocial: convertOptionToValue(newV.apprenti.regimeSocial),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiRegimeSocial,
      setApprentiRegimeSocial,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiDerniereClasse = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.derniereClasse") {
          const newV = {
            apprenti: {
              derniereClasse: {
                ...apprentiDerniereClasse,
                value: data,
              },
            },
          };
          if (apprentiDerniereClasse.value !== newV.apprenti.derniereClasse.value) {
            setApprentiDerniereClasse(newV.apprenti.derniereClasse);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                derniereClasse: convertOptionToValue(newV.apprenti.derniereClasse),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiDerniereClasse,
      setApprentiDerniereClasse,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiIntituleDiplomePrepare = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.intituleDiplomePrepare") {
          const newV = {
            apprenti: {
              intituleDiplomePrepare: {
                ...apprentiIntituleDiplomePrepare,
                value: data,
              },
            },
          };
          if (apprentiIntituleDiplomePrepare.value !== newV.apprenti.intituleDiplomePrepare.value) {
            setApprentiIntituleDiplomePrepare(newV.apprenti.intituleDiplomePrepare);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                intituleDiplomePrepare: newV.apprenti.intituleDiplomePrepare.value,
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiIntituleDiplomePrepare,
      setApprentiIntituleDiplomePrepare,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiInscriptionSportifDeHautNiveau = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.inscriptionSportifDeHautNiveau") {
          const newV = {
            apprenti: {
              inscriptionSportifDeHautNiveau: {
                ...apprentiInscriptionSportifDeHautNiveau,
                value: data,
              },
            },
          };
          if (apprentiInscriptionSportifDeHautNiveau.value !== newV.apprenti.inscriptionSportifDeHautNiveau.value) {
            setApprentiInscriptionSportifDeHautNiveau(newV.apprenti.inscriptionSportifDeHautNiveau);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                inscriptionSportifDeHautNiveau: convertOptionToValue(newV.apprenti.inscriptionSportifDeHautNiveau),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiInscriptionSportifDeHautNiveau,
      setApprentiInscriptionSportifDeHautNiveau,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiHandicap = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.handicap") {
          const newV = {
            apprenti: {
              handicap: {
                ...apprentiHandicap,
                value: data,
              },
            },
          };
          if (apprentiHandicap.value !== newV.apprenti.handicap.value) {
            setApprentiHandicap(newV.apprenti.handicap);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                handicap: convertOptionToValue(newV.apprenti.handicap),
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiHandicap, setApprentiHandicap, dossier?._id, cerfa?.id, setPartApprentiCompletion, setFieldsErrored]
  );

  const onSubmittedApprentiApprentiMineur = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.apprentiMineur") {
          const newV = {
            apprenti: {
              apprentiMineur: {
                ...apprentiApprentiMineur,
                value: data,
              },
            },
          };
          if (apprentiApprentiMineur.value !== newV.apprenti.apprentiMineur.value) {
            setApprentiApprentiMineur(newV.apprenti.apprentiMineur);
            const dbValue = convertOptionToValue(newV.apprenti.apprentiMineur);
            let apprentiMineurNonEmancipeDbValue = null;
            let apprentiMineurNonEmancipeShouldBeLocked = false;
            if (!dbValue) {
              apprentiMineurNonEmancipeDbValue = false;
              apprentiMineurNonEmancipeShouldBeLocked = true;
            }

            setApprentiApprentiMineurNonEmancipe(
              convertValueToOption({
                ...apprentiApprentiMineurNonEmancipe,
                value: apprentiMineurNonEmancipeDbValue,
                options: [
                  {
                    label: "Oui",
                    value: true,
                    locked: apprentiMineurNonEmancipeShouldBeLocked,
                  },
                  {
                    label: "Non",
                    value: false,
                  },
                ],
              })
            );

            let dataToSave = {
              apprenti: {
                apprentiMineur: dbValue,
                apprentiMineurNonEmancipe: apprentiMineurNonEmancipeDbValue,
              },
            };

            dataToSave = await resetInDbResponsableLegalData(dataToSave, dbValue === false, null, dbValue === false);

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));

            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
            if (apprentiMineurNonEmancipeDbValue === false) {
              setFieldsErrored((errors) => errors.filter((e) => e.path !== "apprenti.apprentiMineurNonEmancipe"));
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiApprentiMineur,
      setApprentiApprentiMineur,
      setApprentiApprentiMineurNonEmancipe,
      apprentiApprentiMineurNonEmancipe,
      resetInDbResponsableLegalData,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiApprentiMineurNonEmancipe = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.apprentiMineurNonEmancipe") {
          const newV = {
            apprenti: {
              apprentiMineurNonEmancipe: {
                ...apprentiApprentiMineurNonEmancipe,
                value: data,
              },
            },
          };
          if (apprentiApprentiMineurNonEmancipe.value !== newV.apprenti.apprentiMineurNonEmancipe.value) {
            setApprentiApprentiMineurNonEmancipe(newV.apprenti.apprentiMineurNonEmancipe);

            let dataToSave = {
              apprenti: {
                apprentiMineurNonEmancipe: convertOptionToValue(newV.apprenti.apprentiMineurNonEmancipe),
              },
            };

            dataToSave = await resetInDbResponsableLegalData(
              dataToSave,
              convertOptionToValue(newV.apprenti.apprentiMineurNonEmancipe) === false,
              "apprentiMineurNonEmancipe"
            );

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));

            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiApprentiMineurNonEmancipe,
      setApprentiApprentiMineurNonEmancipe,
      resetInDbResponsableLegalData,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiResponsableLegalNom = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.nom") {
          const newV = {
            apprenti: {
              responsableLegal: {
                nom: {
                  ...apprentiResponsableLegalNom,
                  value: data,
                },
              },
            },
          };
          if (apprentiResponsableLegalNom.value !== newV.apprenti.responsableLegal.nom.value) {
            setApprentiResponsableLegalNom(newV.apprenti.responsableLegal.nom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  nom: newV.apprenti.responsableLegal.nom.value || null,
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalNom,
      setApprentiResponsableLegalNom,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiResponsableLegalPrenom = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.prenom") {
          const newV = {
            apprenti: {
              responsableLegal: {
                prenom: {
                  ...apprentiResponsableLegalPrenom,
                  value: data,
                },
              },
            },
          };
          if (apprentiResponsableLegalPrenom.value !== newV.apprenti.responsableLegal.prenom.value) {
            setApprentiResponsableLegalPrenom(newV.apprenti.responsableLegal.prenom);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  prenom: newV.apprenti.responsableLegal.prenom.value || null,
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalPrenom,
      setApprentiResponsableLegalPrenom,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiResponsableLegalMemeAdresse = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.memeAdresse") {
          const newV = {
            apprenti: {
              responsableLegal: {
                memeAdresse: {
                  ...apprentiResponsableLegalMemeAdresse,
                  value: data,
                },
              },
            },
          };
          if (apprentiResponsableLegalMemeAdresse.value !== newV.apprenti.responsableLegal.memeAdresse.value) {
            setApprentiResponsableLegalMemeAdresse(newV.apprenti.responsableLegal.memeAdresse);
            const memeAdresse = convertOptionToValue(newV.apprenti.responsableLegal.memeAdresse);

            if (memeAdresse) {
              setApprentiResponsableLegalAdresseNumero(apprentiAdresseNumero);
              setApprentiResponsableLegalAdresseVoie(apprentiAdresseVoie);
              setApprentiResponsableLegalAdresseComplement(apprentiAdresseComplement);
              setApprentiResponsableLegalAdresseCodePostal(apprentiAdresseCodePostal);
              setApprentiResponsableLegalAdresseCommune(apprentiAdresseCommune);
              setApprentiResponsableLegalAdressePays(apprentiAdressePays);

              const res = await saveCerfa(dossier?._id, cerfa?.id, {
                apprenti: {
                  responsableLegal: {
                    memeAdresse,
                    adresse: {
                      numero: normalizeInputNumberForDb(apprentiAdresseNumero.value),
                      voie: apprentiAdresseVoie.value || null,
                      complement: apprentiAdresseComplement.value || "",
                      codePostal: apprentiAdresseCodePostal.value || null,
                      commune: apprentiAdresseCommune.value || null,
                      pays: apprentiAdressePays.value || null,
                    },
                  },
                },
              });
              setPartApprentiCompletion(cerfaApprentiCompletion(res));
            } else {
              const res = await saveCerfa(dossier?._id, cerfa?.id, {
                apprenti: {
                  responsableLegal: {
                    memeAdresse,
                    adresse: {
                      numero: normalizeInputNumberForDb(apprentiResponsableLegalAdresseNumero?.value),
                      voie: apprentiResponsableLegalAdresseVoie?.value || null,
                      complement: apprentiResponsableLegalAdresseComplement?.value || "",
                      codePostal: apprentiResponsableLegalAdresseCodePostal?.value || null,
                      commune: apprentiResponsableLegalAdresseCommune?.value || null,
                      pays: convertOptionToValue(apprentiResponsableLegalAdressePays) || null,
                    },
                  },
                },
              });
              setPartApprentiCompletion(cerfaApprentiCompletion(res));
              setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalMemeAdresse,
      setApprentiResponsableLegalMemeAdresse,
      setApprentiResponsableLegalAdresseNumero,
      apprentiAdresseNumero,
      setApprentiResponsableLegalAdresseVoie,
      apprentiAdresseVoie,
      setApprentiResponsableLegalAdresseComplement,
      apprentiAdresseComplement,
      setApprentiResponsableLegalAdresseCodePostal,
      apprentiAdresseCodePostal,
      setApprentiResponsableLegalAdresseCommune,
      apprentiAdresseCommune,
      setApprentiResponsableLegalAdressePays,
      apprentiAdressePays,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      apprentiResponsableLegalAdresseNumero?.value,
      apprentiResponsableLegalAdresseVoie?.value,
      apprentiResponsableLegalAdresseComplement?.value,
      apprentiResponsableLegalAdresseCodePostal?.value,
      apprentiResponsableLegalAdresseCommune?.value,
      apprentiResponsableLegalAdressePays,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiResponsableLegalAdresseNumero = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.adresse.numero") {
          const newV = {
            apprenti: {
              responsableLegal: {
                adresse: {
                  numero: {
                    ...apprentiResponsableLegalAdresseNumero,
                    value: data,
                  },
                },
              },
            },
          };
          if (apprentiResponsableLegalAdresseNumero.value !== newV.apprenti.responsableLegal.adresse.numero.value) {
            setApprentiResponsableLegalAdresseNumero(newV.apprenti.responsableLegal.adresse.numero);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  adresse: {
                    numero: normalizeInputNumberForDb(data),
                  },
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalAdresseNumero,
      setApprentiResponsableLegalAdresseNumero,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
    ]
  );

  const onSubmittedApprentiResponsableLegalAdresseVoie = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.adresse.voie") {
          const newV = {
            apprenti: {
              responsableLegal: {
                adresse: {
                  voie: {
                    ...apprentiResponsableLegalAdresseVoie,
                    value: data,
                  },
                },
              },
            },
          };
          if (apprentiResponsableLegalAdresseVoie.value !== newV.apprenti.responsableLegal.adresse.voie.value) {
            setApprentiResponsableLegalAdresseVoie(newV.apprenti.responsableLegal.adresse.voie);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  adresse: {
                    voie: newV.apprenti.responsableLegal.adresse.voie.value,
                  },
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalAdresseVoie,
      setApprentiResponsableLegalAdresseVoie,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiResponsableLegalAdresseComplement = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.adresse.complement") {
          const newV = {
            apprenti: {
              responsableLegal: {
                adresse: {
                  complement: {
                    ...apprentiResponsableLegalAdresseComplement,
                    value: data,
                  },
                },
              },
            },
          };
          if (
            apprentiResponsableLegalAdresseComplement.value !== newV.apprenti.responsableLegal.adresse.complement.value
          ) {
            setApprentiResponsableLegalAdresseComplement(newV.apprenti.responsableLegal.adresse.complement);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  adresse: {
                    complement: newV.apprenti.responsableLegal.adresse.complement.value,
                  },
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalAdresseComplement,
      setApprentiResponsableLegalAdresseComplement,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
    ]
  );

  const onSubmittedApprentiResponsableLegalAdresseCodePostal = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.adresse.codePostal") {
          const newV = {
            apprenti: {
              responsableLegal: {
                adresse: {
                  codePostal: {
                    ...apprentiResponsableLegalAdresseCodePostal,
                    value: data.codePostal,
                  },
                  commune: {
                    ...apprentiResponsableLegalAdresseCommune,
                    value: data.commune,
                  },
                },
              },
            },
          };
          if (
            apprentiResponsableLegalAdresseCodePostal.value !== newV.apprenti.responsableLegal.adresse.codePostal.value
          ) {
            setApprentiResponsableLegalAdresseCodePostal(newV.apprenti.responsableLegal.adresse.codePostal);
            setApprentiResponsableLegalAdresseCommune(newV.apprenti.responsableLegal.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  adresse: {
                    codePostal: newV.apprenti.responsableLegal.adresse.codePostal.value,
                    commune: newV.apprenti.responsableLegal.adresse.commune.value,
                  },
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== "apprenti.responsableLegal.adresse.commune"));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalAdresseCodePostal,
      apprentiResponsableLegalAdresseCommune,
      setApprentiResponsableLegalAdresseCodePostal,
      setApprentiResponsableLegalAdresseCommune,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiResponsableLegalAdresseCommune = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.adresse.commune") {
          const newV = {
            apprenti: {
              responsableLegal: {
                adresse: {
                  commune: {
                    ...apprentiResponsableLegalAdresseCommune,
                    value: data,
                  },
                },
              },
            },
          };
          if (apprentiResponsableLegalAdresseCommune.value !== newV.apprenti.responsableLegal.adresse.commune.value) {
            setApprentiResponsableLegalAdresseCommune(newV.apprenti.responsableLegal.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  adresse: {
                    commune: newV.apprenti.responsableLegal.adresse.commune.value,
                  },
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalAdresseCommune,
      setApprentiResponsableLegalAdresseCommune,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const onSubmittedApprentiResponsableLegalAdressePays = useCallback(
    async (path, data) => {
      try {
        if (path === "apprenti.responsableLegal.adresse.pays") {
          const newV = {
            apprenti: {
              responsableLegal: {
                adresse: {
                  pays: {
                    ...apprentiResponsableLegalAdressePays,
                    value: data,
                  },
                },
              },
            },
          };
          if (apprentiResponsableLegalAdressePays.value !== newV.apprenti.responsableLegal.adresse.pays.value) {
            setApprentiResponsableLegalAdressePays(newV.apprenti.responsableLegal.adresse.pays);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  adresse: {
                    pays: convertOptionToValue(newV.apprenti.responsableLegal.adresse.pays),
                  },
                },
              },
            });
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
            setFieldsErrored((errors) => errors.filter((e) => e.path !== path));
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      apprentiResponsableLegalAdressePays,
      setApprentiResponsableLegalAdressePays,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      setFieldsErrored,
    ]
  );

  const validation = useCallback(
    (action) => {
      let fields = [
        apprentiNom,
        apprentiPrenom,
        apprentiSexe,
        apprentiNationalite,
        apprentiDateNaissance,
        apprentiDepartementNaissance,
        apprentiCommuneNaissance,
        apprentiRegimeSocial,
        apprentiHandicap,
        apprentiSituationAvantContrat,
        apprentiDiplome,
        apprentiDerniereClasse,
        apprentiDiplomePrepare,
        apprentiIntituleDiplomePrepare,
        apprentiTelephone,
        apprentiCourriel,
        apprentiInscriptionSportifDeHautNiveau,
        apprentiApprentiMineur,
        apprentiApprentiMineurNonEmancipe,
        apprentiAdresseVoie,
        apprentiAdresseCodePostal,
        apprentiAdresseCommune,
        apprentiAdressePays,
      ];

      let setterFields = [
        setApprentiAdresseCodePostal,
        setApprentiAdresseCommune,
        setApprentiAdressePays,
        setApprentiAdresseVoie,
        setApprentiApprentiMineur,
        setApprentiApprentiMineurNonEmancipe,
        setApprentiCommuneNaissance,
        setApprentiCourriel,
        setApprentiDateNaissance,
        setApprentiDepartementNaissance,
        setApprentiDerniereClasse,
        setApprentiDiplome,
        setApprentiDiplomePrepare,
        setApprentiHandicap,
        setApprentiInscriptionSportifDeHautNiveau,
        setApprentiIntituleDiplomePrepare,
        setApprentiNationalite,
        setApprentiNom,
        setApprentiPrenom,
        setApprentiRegimeSocial,
        setApprentiSexe,
        setApprentiSituationAvantContrat,
        setApprentiTelephone,
      ];

      // TODO dbValue instead
      if (apprentiApprentiMineurNonEmancipe.value === "Oui") {
        fields = [
          ...fields,
          apprentiResponsableLegalNom,
          apprentiResponsableLegalPrenom,
          apprentiResponsableLegalMemeAdresse,
        ];
        setterFields = [
          ...setterFields,
          setApprentiResponsableLegalNom,
          setApprentiResponsableLegalPrenom,
          setApprentiResponsableLegalMemeAdresse,
        ];

        // TODO dbValue instead
        if (apprentiResponsableLegalMemeAdresse.value === "Non") {
          fields = [
            ...fields,
            apprentiResponsableLegalAdresseVoie,
            apprentiResponsableLegalAdresseCodePostal,
            apprentiResponsableLegalAdresseCommune,
            apprentiResponsableLegalAdressePays,
          ];
          setterFields = [
            ...setterFields,
            setApprentiResponsableLegalAdresseVoie,
            setApprentiResponsableLegalAdresseCodePostal,
            setApprentiResponsableLegalAdresseCommune,
            setApprentiResponsableLegalAdressePays,
          ];
        }
      }

      fieldsChecker({
        action,
        fields,
        setterFields,
        setFieldsErrored,
        setIsValidating,
        resetCheckFields,
        fieldsValided,
        setFieldsValided,
        fieldsErrored,
      });
    },
    [
      apprentiAdresseCodePostal,
      apprentiAdresseCommune,
      apprentiAdressePays,
      apprentiAdresseVoie,
      apprentiApprentiMineur,
      apprentiApprentiMineurNonEmancipe,
      apprentiCommuneNaissance,
      apprentiCourriel,
      apprentiDateNaissance,
      apprentiDepartementNaissance,
      apprentiDerniereClasse,
      apprentiDiplome,
      apprentiDiplomePrepare,
      apprentiHandicap,
      apprentiInscriptionSportifDeHautNiveau,
      apprentiIntituleDiplomePrepare,
      apprentiNationalite,
      apprentiNom,
      apprentiPrenom,
      apprentiRegimeSocial,
      apprentiResponsableLegalAdresseCodePostal,
      apprentiResponsableLegalAdresseCommune,
      apprentiResponsableLegalAdressePays,
      apprentiResponsableLegalAdresseVoie,
      apprentiResponsableLegalMemeAdresse,
      apprentiResponsableLegalNom,
      apprentiResponsableLegalPrenom,
      apprentiSexe,
      apprentiSituationAvantContrat,
      apprentiTelephone,
      fieldsErrored,
      fieldsValided,
      resetCheckFields,
      setApprentiAdresseCodePostal,
      setApprentiAdresseCommune,
      setApprentiAdressePays,
      setApprentiAdresseVoie,
      setApprentiApprentiMineur,
      setApprentiApprentiMineurNonEmancipe,
      setApprentiCommuneNaissance,
      setApprentiCourriel,
      setApprentiDateNaissance,
      setApprentiDepartementNaissance,
      setApprentiDerniereClasse,
      setApprentiDiplome,
      setApprentiDiplomePrepare,
      setApprentiHandicap,
      setApprentiInscriptionSportifDeHautNiveau,
      setApprentiIntituleDiplomePrepare,
      setApprentiNationalite,
      setApprentiNom,
      setApprentiPrenom,
      setApprentiRegimeSocial,
      setApprentiResponsableLegalAdresseCodePostal,
      setApprentiResponsableLegalAdresseCommune,
      setApprentiResponsableLegalAdressePays,
      setApprentiResponsableLegalAdresseVoie,
      setApprentiResponsableLegalMemeAdresse,
      setApprentiResponsableLegalNom,
      setApprentiResponsableLegalPrenom,
      setApprentiSexe,
      setApprentiSituationAvantContrat,
      setApprentiTelephone,
      setFieldsErrored,
      setFieldsValided,
      setIsValidating,
    ]
  );

  const setAll = useCallback(
    (res) => {
      const { apprenti } = res;
      setApprentiNom({ ...apprenti.nom, setField: setApprentiNom, errored: null });
      setApprentiPrenom({ ...apprenti.prenom, setField: setApprentiPrenom, errored: null });
      setApprentiSexe({ ...convertValueToOption(apprenti.sexe), setField: setApprentiSexe, errored: null });
      setApprentiNationalite({
        ...convertValueToOption(apprenti.nationalite),
        setField: setApprentiNationalite,
        errored: null,
      });
      setApprentiDateNaissance({
        ...convertValueToDate(apprenti.dateNaissance),
        setField: setApprentiDateNaissance,
        errored: null,
      });
      setApprentiAge(apprenti.age);
      setApprentiDepartementNaissance({
        ...apprenti.departementNaissance,
        setField: setApprentiDepartementNaissance,
        errored: null,
      });
      setApprentiCommuneNaissance({
        ...apprenti.communeNaissance,
        setField: setApprentiCommuneNaissance,
        errored: null,
      });
      setApprentiNir(apprenti.nir);
      setApprentiRegimeSocial({
        ...convertValueToOption(apprenti.regimeSocial),
        setField: setApprentiRegimeSocial,
        errored: null,
      });
      setApprentiHandicap({
        ...convertValueToOption(apprenti.handicap),
        setField: setApprentiHandicap,
        errored: null,
      });
      setApprentiSituationAvantContrat({
        ...convertValueToOption(apprenti.situationAvantContrat),
        setField: setApprentiSituationAvantContrat,
        errored: null,
      });

      setApprentiDiplome({
        ...convertValueToMultipleSelectOption(apprenti.diplome),
        setField: setApprentiDiplome,
        errored: null,
      });
      setApprentiDerniereClasse({
        ...convertValueToOption(apprenti.derniereClasse),
        setField: setApprentiDerniereClasse,
        errored: null,
      });
      setApprentiDiplomePrepare({
        ...convertValueToMultipleSelectOption(apprenti.diplomePrepare),
        setField: setApprentiDiplomePrepare,
        errored: null,
      });

      setApprentiIntituleDiplomePrepare({
        ...apprenti.intituleDiplomePrepare,
        setField: setApprentiIntituleDiplomePrepare,
        errored: null,
      });
      setApprentiTelephone({
        ...apprenti.telephone,
        value: apprenti.telephone.value.replace("+", ""),
        setField: setApprentiTelephone,
        errored: null,
      });
      setApprentiCourriel({ ...apprenti.courriel, setField: setApprentiCourriel, errored: null });
      setApprentiAdresseNumero(apprenti.adresse.numero);
      setApprentiAdresseVoie({ ...apprenti.adresse.voie, setField: setApprentiAdresseVoie, errored: null });
      setApprentiAdresseComplement(apprenti.adresse.complement);
      setApprentiAdresseCodePostal({
        ...apprenti.adresse.codePostal,
        setField: setApprentiAdresseCodePostal,
        errored: null,
      });
      setApprentiAdresseCommune({
        ...apprenti.adresse.commune,
        setField: setApprentiAdresseCommune,
        errored: null,
      });
      setApprentiAdressePays({
        ...convertValueToOption(apprenti.adresse.pays),
        setField: setApprentiAdressePays,
        errored: null,
      });
      setApprentiInscriptionSportifDeHautNiveau({
        ...convertValueToOption(apprenti.inscriptionSportifDeHautNiveau),
        setField: setApprentiInscriptionSportifDeHautNiveau,
        errored: null,
      });

      setApprentiApprentiMineur({
        ...convertValueToOption(apprenti.apprentiMineur),
        setField: setApprentiApprentiMineur,
        errored: null,
      });

      let apprentiMineurNonEmancipeShouldBeLocked = false;
      if (apprenti.apprentiMineur.value === false) {
        apprentiMineurNonEmancipeShouldBeLocked = true;
      }

      setApprentiApprentiMineurNonEmancipe({
        ...convertValueToOption({
          ...apprenti.apprentiMineurNonEmancipe,
          options: [
            {
              label: "Oui",
              value: true,
              locked: apprentiMineurNonEmancipeShouldBeLocked,
            },
            {
              label: "Non",
              value: false,
            },
          ],
        }),
        setField: setApprentiApprentiMineurNonEmancipe,
        errored: null,
      });

      setApprentiResponsableLegalNom({
        ...apprenti.responsableLegal.nom,
        setField: setApprentiResponsableLegalNom,
        errored: null,
      });
      setApprentiResponsableLegalPrenom({
        ...apprenti.responsableLegal.prenom,
        setField: setApprentiResponsableLegalPrenom,
        errored: null,
      });
      setApprentiResponsableLegalMemeAdresse({
        ...convertValueToOption(apprenti.responsableLegal.memeAdresse),
        setField: setApprentiResponsableLegalMemeAdresse,
        errored: null,
      });
      setApprentiResponsableLegalAdresseNumero(apprenti.responsableLegal.adresse.numero);
      setApprentiResponsableLegalAdresseVoie({
        ...apprenti.responsableLegal.adresse.voie,
        setField: setApprentiResponsableLegalAdresseVoie,
        errored: null,
      });
      setApprentiResponsableLegalAdresseComplement(apprenti.responsableLegal.adresse.complement);
      setApprentiResponsableLegalAdresseCodePostal(apprenti.responsableLegal.adresse.codePostal);
      setApprentiResponsableLegalAdresseCommune(apprenti.responsableLegal.adresse.commune);
      setApprentiResponsableLegalAdressePays(convertValueToOption(apprenti.responsableLegal.adresse.pays));

      setPartApprentiCompletion(cerfaApprentiCompletion(res));
    },
    [
      setApprentiNom,
      setApprentiPrenom,
      setApprentiSexe,
      setApprentiNationalite,
      setApprentiDateNaissance,
      setApprentiAge,
      setApprentiDepartementNaissance,
      setApprentiCommuneNaissance,
      setApprentiNir,
      setApprentiRegimeSocial,
      setApprentiHandicap,
      setApprentiSituationAvantContrat,
      setApprentiDiplome,
      setApprentiDerniereClasse,
      setApprentiDiplomePrepare,
      setApprentiIntituleDiplomePrepare,
      setApprentiTelephone,
      setApprentiCourriel,
      setApprentiAdresseNumero,
      setApprentiAdresseVoie,
      setApprentiAdresseComplement,
      setApprentiAdresseCodePostal,
      setApprentiAdresseCommune,
      setApprentiAdressePays,
      setApprentiInscriptionSportifDeHautNiveau,
      setApprentiApprentiMineur,
      setApprentiApprentiMineurNonEmancipe,
      setApprentiResponsableLegalNom,
      setApprentiResponsableLegalPrenom,
      setApprentiResponsableLegalMemeAdresse,
      setApprentiResponsableLegalAdresseNumero,
      setApprentiResponsableLegalAdresseVoie,
      setApprentiResponsableLegalAdresseComplement,
      setApprentiResponsableLegalAdresseCodePostal,
      setApprentiResponsableLegalAdresseCommune,
      setApprentiResponsableLegalAdressePays,
      setPartApprentiCompletion,
    ]
  );

  useEffect(() => {
    if (cerfa && isLoading) {
      setAll(cerfa);
      setIsLoading(false);
    }
    if (isValidating) {
      validation("check");
    }
  }, [cerfa, isLoading, isValidating, setAll, setIsLoading, validation]);

  return {
    isLoading,
    //
    validation,
    resetCheckFields,
    fieldsErrored,
    //
    completion: partApprentiCompletion,
    get: {
      apprenti: {
        nom: apprentiNom,
        prenom: apprentiPrenom,
        sexe: apprentiSexe,
        nationalite: apprentiNationalite,
        dateNaissance: apprentiDateNaissance,
        departementNaissance: apprentiDepartementNaissance,
        communeNaissance: apprentiCommuneNaissance,
        nir: apprentiNir,
        regimeSocial: apprentiRegimeSocial,
        handicap: apprentiHandicap,
        situationAvantContrat: apprentiSituationAvantContrat,
        diplome: apprentiDiplome,
        derniereClasse: apprentiDerniereClasse,
        diplomePrepare: apprentiDiplomePrepare,
        intituleDiplomePrepare: apprentiIntituleDiplomePrepare,
        telephone: apprentiTelephone,
        courriel: apprentiCourriel,
        adresse: {
          numero: apprentiAdresseNumero,
          voie: apprentiAdresseVoie,
          complement: apprentiAdresseComplement,
          codePostal: apprentiAdresseCodePostal,
          commune: apprentiAdresseCommune,
          pays: apprentiAdressePays,
        },
        apprentiMineur: apprentiApprentiMineur,
        apprentiMineurNonEmancipe: apprentiApprentiMineurNonEmancipe,
        responsableLegal: {
          nom: apprentiResponsableLegalNom,
          prenom: apprentiResponsableLegalPrenom,
          memeAdresse: apprentiResponsableLegalMemeAdresse,
          adresse: {
            numero: apprentiResponsableLegalAdresseNumero,
            voie: apprentiResponsableLegalAdresseVoie,
            complement: apprentiResponsableLegalAdresseComplement,
            codePostal: apprentiResponsableLegalAdresseCodePostal,
            commune: apprentiResponsableLegalAdresseCommune,
            pays: apprentiResponsableLegalAdressePays,
          },
        },
        inscriptionSportifDeHautNiveau: apprentiInscriptionSportifDeHautNiveau,
      },
    },
    setAll,
    onSubmit: {
      apprenti: {
        nom: onSubmittedApprentiNom,
        prenom: onSubmittedApprentiPrenom,
        sexe: onSubmittedApprentiSexe,
        nationalite: onSubmittedApprentiNationalite,
        departementNaissance: onSubmittedApprentiDepartementNaissance,
        communeNaissance: onSubmittedApprentiCommuneNaissance,
        dateNaissance: onSubmittedApprentiDateNaissance,
        regimeSocial: onSubmittedApprentiRegimeSocial,
        handicap: onSubmittedApprentiHandicap,
        situationAvantContrat: onSubmittedApprentiSituationAvantContrat,
        diplome: onSubmittedApprentiDiplome,
        derniereClasse: onSubmittedApprentiDerniereClasse,
        diplomePrepare: onSubmittedApprentiDiplomePrepare,
        intituleDiplomePrepare: onSubmittedApprentiIntituleDiplomePrepare,
        telephone: onSubmittedApprentiTelephone,
        courriel: onSubmittedApprentiCourriel,
        adresse: {
          numero: onSubmittedApprentiAdresseNumero,
          voie: onSubmittedApprentiAdresseVoie,
          complement: onSubmittedApprentiAdresseComplement,
          codePostal: onSubmittedApprentiAdresseCodePostal,
          commune: onSubmittedApprentiAdresseCommune,
          pays: onSubmittedApprentiAdressePays,
        },
        apprentiMineur: onSubmittedApprentiApprentiMineur,
        apprentiMineurNonEmancipe: onSubmittedApprentiApprentiMineurNonEmancipe,
        responsableLegal: {
          nom: onSubmittedApprentiResponsableLegalNom,
          prenom: onSubmittedApprentiResponsableLegalPrenom,
          memeAdresse: onSubmittedApprentiResponsableLegalMemeAdresse,
          adresse: {
            numero: onSubmittedApprentiResponsableLegalAdresseNumero,
            voie: onSubmittedApprentiResponsableLegalAdresseVoie,
            complement: onSubmittedApprentiResponsableLegalAdresseComplement,
            codePostal: onSubmittedApprentiResponsableLegalAdresseCodePostal,
            commune: onSubmittedApprentiResponsableLegalAdresseCommune,
            pays: onSubmittedApprentiResponsableLegalAdressePays,
          },
        },
        inscriptionSportifDeHautNiveau: onSubmittedApprentiInscriptionSportifDeHautNiveau,
      },
    },
  };
}

/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  fieldCompletionPercentage,
  convertValueToDate,
  convertDateToValue,
  convertValueToMultipleSelectOption,
  convertMultipleSelectOptionToValue,
  convertOptionToValue,
  convertValueToOption,
  isAgeInValidAtDate,
  caclAgeFromStringDate,
  normalizeInputNumberForDb,
} from "../../../utils/formUtils";
import { saveCerfa } from "../useCerfa";
import { cerfaAtom } from "../cerfaAtom";
import { dossierAtom } from "../../useDossier/dossierAtom";
import * as apprentiAtoms from "./useCerfaApprentiAtoms";
import { buildRemunerations } from "../parts/useCerfaContrat";
import { useCerfaContrat } from "../parts/useCerfaContrat";

const cerfaApprentiCompletion = (res) => {
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
  const majeur = res.apprenti.age.value >= 18;
  const nonEmancipe = res.apprenti.apprentiMineurNonEmancipe.value;
  const apprentiResponsableLegalMemeAdresse = res.apprenti.responsableLegal.memeAdresse.value;

  if (!majeur) {
    fieldsToKeep = {
      ...fieldsToKeep,
      apprentiApprentiMineurNonEmancipe: res.apprenti.apprentiMineurNonEmancipe,
    };
    countFields = countFields + 1;
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
  }

  return fieldCompletionPercentage(fieldsToKeep, countFields);
};

export const CerfaApprentiController = async (dossier) => {
  return {
    apprenti: {
      dateNaissance: {
        doAsyncActions: async (value, data) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const { age, dateNaissance } = caclAgeFromStringDate(value);

          if (age === 0) {
            return {
              successed: false,
              data: null,
              message: "La date de naissance de peut pas être dans le futur",
            };
          }

          if (age < 14) {
            return {
              successed: false,
              data: null,
              message: "L'apprenti(e) doit avoir au moins 15 ans à la date de début d'exécution du contrat",
            };
          }

          const isAgeApprentiInvalidAtStart = isAgeInValidAtDate({
            dateNaissance,
            age,
            dateString: data.dateDebutContrat,
            limitAge: 15,
            label: "L'apprenti(e) doit avoir au moins 15 ans à la date de début d'exécution du contrat",
          });
          if (isAgeApprentiInvalidAtStart) return isAgeApprentiInvalidAtStart;

          if (data.dateDebutContrat !== "" && data.dateFinContrat !== "") {
            const { remunerationsAnnuelles, salaireEmbauche, remunerationsAnnuellesDbValue } = buildRemunerations({
              apprentiDateNaissance: value,
              apprentiAge: age,
              dateDebutContrat: data.dateDebutContrat,
              dateFinContrat: data.dateFinContrat,
              remunerationMajoration: data.remunerationMajoration,
            });

            return {
              successed: true,
              data: {
                dateNaissance: value,
                age,
                remunerationsAnnuelles,
                remunerationsAnnuellesDbValue,
                salaireEmbauche,
              },
              message: null,
            };
          }

          return {
            successed: true,
            data: {
              dateNaissance: value,
              age,
            },
            message: null,
          };
        },
      },
    },
  };
};

export function useCerfaApprenti() {
  const cerfa = useRecoilValue(cerfaAtom);
  const dossier = useRecoilValue(dossierAtom);
  const { setRemunerations } = useCerfaContrat();

  const [partApprentiCompletion, setPartApprentiCompletion] = useRecoilState(
    apprentiAtoms.cerfaPartApprentiCompletionAtom
  );

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
  const [apprentiInscriptionSportifDeHautNiveau, setApprentiInscriptionSportifDeHautNiveau] = useRecoilState(
    apprentiAtoms.cerfaApprentiInscriptionSportifDeHautNiveauAtom
  );

  const resetInDbResponsableLegalData = useCallback(
    async (prevDataToSave, reset, skipKey) => {
      let dataToSave = prevDataToSave;
      if (reset) {
        dataToSave = {
          ...dataToSave,
          apprenti: {
            ...dataToSave.apprenti,
            apprentiMineurNonEmancipe:
              skipKey === "apprentiMineurNonEmancipe" ? dataToSave.apprenti.apprentiMineurNonEmancipe : null,
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiNom, setApprentiNom, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiPrenom, setApprentiPrenom, dossier?._id, cerfa?.id, setPartApprentiCompletion]
  );

  const onSubmittedApprentiDateNaissance = useCallback(
    async (path, data) => {
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
          if (apprentiDateNaissance.value !== newV.apprenti.dateNaissance.value) {
            setApprentiDateNaissance(newV.apprenti.dateNaissance);
            setApprentiAge(newV.apprenti.age);

            let dataToSave = {
              apprenti: {
                dateNaissance: convertDateToValue(newV.apprenti.dateNaissance),
                age: newV.apprenti.age.value,
              },
            };
            if (data.remunerationsAnnuelles && data.remunerationsAnnuellesDbValue && data.salaireEmbauche) {
              setRemunerations(data);
              dataToSave = {
                ...dataToSave,
                contrat: {
                  remunerationsAnnuelles: data.remunerationsAnnuellesDbValue,
                  salaireEmbauche: data.salaireEmbauche.toFixed(2),
                },
              };
            }

            dataToSave = await resetInDbResponsableLegalData(dataToSave, data.age >= 18);

            const res = await saveCerfa(dossier?._id, cerfa?.id, dataToSave);
            setPartApprentiCompletion(cerfaApprentiCompletion(res));
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
      resetInDbResponsableLegalData,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
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

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                adresse: {
                  numero: normalizeInputNumberForDb(data),
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
    [apprentiAdresseNumero, setApprentiAdresseNumero, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                  // forceUpdate: false, // IF data = "" true
                },
              },
            },
          };
          if (apprentiAdresseVoie.value !== newV.apprenti.adresse.voie.value) {
            setApprentiAdresseVoie(newV.apprenti.adresse.voie);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                adresse: {
                  voie: newV.apprenti.adresse.voie.value,
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
    [apprentiAdresseVoie, setApprentiAdresseVoie, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                  // forceUpdate: false, // IF data = "" true
                },
              },
            },
          };
          if (apprentiAdresseComplement.value !== newV.apprenti.adresse.complement.value) {
            setApprentiAdresseComplement(newV.apprenti.adresse.complement);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                adresse: {
                  complement: newV.apprenti.adresse.complement.value,
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
    [apprentiAdresseComplement, setApprentiAdresseComplement, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                  value: data,
                  // forceUpdate: false, // IF data = "" true
                },
              },
            },
          };
          if (apprentiAdresseCodePostal.value !== newV.apprenti.adresse.codePostal.value) {
            setApprentiAdresseCodePostal(newV.apprenti.adresse.codePostal);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                adresse: {
                  codePostal: newV.apprenti.adresse.codePostal.value,
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
    [apprentiAdresseCodePostal, setApprentiAdresseCodePostal, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                  // forceUpdate: false, // IF data = "" true
                },
              },
            },
          };
          if (apprentiAdresseCommune.value !== newV.apprenti.adresse.commune.value) {
            setApprentiAdresseCommune(newV.apprenti.adresse.commune);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                adresse: {
                  commune: newV.apprenti.adresse.commune.value,
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
    [apprentiAdresseCommune, setApprentiAdresseCommune, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiTelephone, setApprentiTelephone, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiCourriel, setApprentiCourriel, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiDepartementNaissance, setApprentiDepartementNaissance, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiCommuneNaissance, setApprentiCommuneNaissance, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiDiplome, setApprentiDiplome, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiDiplomePrepare, setApprentiDiplomePrepare, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiSexe, setApprentiSexe, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiNationalite, setApprentiNationalite, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiRegimeSocial, setApprentiRegimeSocial, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiDerniereClasse, setApprentiDerniereClasse, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                // forceUpdate: false, // IF data = "" true
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
                // forceUpdate: false, // IF data = "" true
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
                // forceUpdate: false, // IF data = "" true
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiHandicap, setApprentiHandicap, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apprentiResponsableLegalNom, setApprentiResponsableLegalNom, dossier?._id, cerfa?.id, setPartApprentiCompletion]
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
                    },
                  },
                },
              });
              setPartApprentiCompletion(cerfaApprentiCompletion(res));
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
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
      apprentiResponsableLegalAdresseNumero?.value,
      apprentiResponsableLegalAdresseVoie?.value,
      apprentiResponsableLegalAdresseComplement?.value,
      apprentiResponsableLegalAdresseCodePostal?.value,
      apprentiResponsableLegalAdresseCommune?.value,
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
                    value: data,
                  },
                },
              },
            },
          };
          if (
            apprentiResponsableLegalAdresseCodePostal.value !== newV.apprenti.responsableLegal.adresse.codePostal.value
          ) {
            setApprentiResponsableLegalAdresseCodePostal(newV.apprenti.responsableLegal.adresse.codePostal);

            const res = await saveCerfa(dossier?._id, cerfa?.id, {
              apprenti: {
                responsableLegal: {
                  adresse: {
                    codePostal: newV.apprenti.responsableLegal.adresse.codePostal.value,
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
      apprentiResponsableLegalAdresseCodePostal,
      setApprentiResponsableLegalAdresseCodePostal,
      dossier?._id,
      cerfa?.id,
      setPartApprentiCompletion,
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
    ]
  );

  const setAll = async (res) => {
    setApprentiNom(res.apprenti.nom);
    setApprentiPrenom(res.apprenti.prenom);
    setApprentiSexe(convertValueToOption(res.apprenti.sexe));
    setApprentiNationalite(convertValueToOption(res.apprenti.nationalite));
    setApprentiDateNaissance(convertValueToDate(res.apprenti.dateNaissance));
    setApprentiAge(res.apprenti.age);
    setApprentiDepartementNaissance(res.apprenti.departementNaissance);
    setApprentiCommuneNaissance(res.apprenti.communeNaissance);
    setApprentiNir(res.apprenti.nir);
    setApprentiRegimeSocial(convertValueToOption(res.apprenti.regimeSocial));
    setApprentiHandicap(convertValueToOption(res.apprenti.handicap));
    setApprentiSituationAvantContrat(convertValueToOption(res.apprenti.situationAvantContrat));

    setApprentiDiplome(convertValueToMultipleSelectOption(res.apprenti.diplome));
    setApprentiDerniereClasse(convertValueToOption(res.apprenti.derniereClasse));
    setApprentiDiplomePrepare(convertValueToMultipleSelectOption(res.apprenti.diplomePrepare));

    setApprentiIntituleDiplomePrepare(res.apprenti.intituleDiplomePrepare);
    setApprentiTelephone({ ...res.apprenti.telephone, value: res.apprenti.telephone.value.replace("+", "") });
    setApprentiCourriel(res.apprenti.courriel);
    setApprentiAdresseNumero(res.apprenti.adresse.numero);
    setApprentiAdresseVoie(res.apprenti.adresse.voie);
    setApprentiAdresseComplement(res.apprenti.adresse.complement);
    setApprentiAdresseCodePostal(res.apprenti.adresse.codePostal);
    setApprentiAdresseCommune(res.apprenti.adresse.commune);
    setApprentiInscriptionSportifDeHautNiveau(convertValueToOption(res.apprenti.inscriptionSportifDeHautNiveau));

    setApprentiApprentiMineurNonEmancipe(convertValueToOption(res.apprenti.apprentiMineurNonEmancipe));
    setApprentiResponsableLegalNom(res.apprenti.responsableLegal.nom);
    setApprentiResponsableLegalPrenom(res.apprenti.responsableLegal.prenom);
    setApprentiResponsableLegalMemeAdresse(convertValueToOption(res.apprenti.responsableLegal.memeAdresse));
    setApprentiResponsableLegalAdresseNumero(res.apprenti.responsableLegal.adresse.numero);
    setApprentiResponsableLegalAdresseVoie(res.apprenti.responsableLegal.adresse.voie);
    setApprentiResponsableLegalAdresseComplement(res.apprenti.responsableLegal.adresse.complement);
    setApprentiResponsableLegalAdresseCodePostal(res.apprenti.responsableLegal.adresse.codePostal);
    setApprentiResponsableLegalAdresseCommune(res.apprenti.responsableLegal.adresse.commune);

    setPartApprentiCompletion(cerfaApprentiCompletion(res));
  };

  return {
    completion: partApprentiCompletion,
    get: {
      apprenti: {
        nom: apprentiNom,
        prenom: apprentiPrenom,
        sexe: apprentiSexe,
        nationalite: apprentiNationalite,
        dateNaissance: apprentiDateNaissance,
        age: apprentiAge,
        majeur: apprentiAge?.value >= 18,
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
        },
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
        },
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
          },
        },
        inscriptionSportifDeHautNiveau: onSubmittedApprentiInscriptionSportifDeHautNiveau,
      },
    },
  };
}

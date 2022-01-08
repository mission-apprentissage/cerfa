/***
 * Multiple states on purpose to avoid full re-rendering at each modification
 */

import { useCallback } from "react";
// import { DateTime } from "luxon";
// import { _post } from "../../../httpClient";
import { useRecoilState } from "recoil";
import * as contratAtoms from "./useCerfaContratAtoms";

export const CerfaContratController = async (dossier) => {
  return {
    contrat: {},
  };
};

export function useCerfaContrat() {
  const [contratModeContractuel, setContratModeContractuel] = useRecoilState(
    contratAtoms.cerfaContratModeContractuelAtom
  );
  const [contratTypeContratApp, setContratTypeContratApp] = useRecoilState(contratAtoms.cerfaContratTypeContratAppAtom);
  const [contratNumeroContratPrecedent, setContratNumeroContratPrecedent] = useRecoilState(
    contratAtoms.cerfaContratNumeroContratPrecedentAtom
  );
  const [contratNoContrat, setContratNoContrat] = useRecoilState(contratAtoms.cerfaContratNoContratAtom);
  const [contratNoAvenant, setContratNoAvenant] = useRecoilState(contratAtoms.cerfaContratNoAvenantAtom);
  const [contratDateDebutContrat, setContratDateDebutContrat] = useRecoilState(
    contratAtoms.cerfaContratDateDebutContratAtom
  );
  const [contratDateEffetAvenant, setContratDateEffetAvenant] = useRecoilState(
    contratAtoms.cerfaContratDateEffetAvenantAtom
  );
  const [contratDateConclusion, setContratDateConclusion] = useRecoilState(contratAtoms.cerfaContratDateConclusionAtom);
  const [contratDateFinContrat, setContratDateFinContrat] = useRecoilState(contratAtoms.cerfaContratDateFinContratAtom);
  const [contratDateRupture, setContratDateRupture] = useRecoilState(contratAtoms.cerfaContratDateRuptureAtom);
  const [contratLieuSignatureContrat, setContratLieuSignatureContrat] = useRecoilState(
    contratAtoms.cerfaContratLieuSignatureContratAtom
  );
  const [contratTypeDerogation, setContratTypeDerogation] = useRecoilState(contratAtoms.cerfaContratTypeDerogationAtom);
  const [contratDureeTravailHebdoHeures, setContratDureeTravailHebdoHeures] = useRecoilState(
    contratAtoms.cerfaContratDureeTravailHebdoHeuresAtom
  );
  const [contratDureeTravailHebdoMinutes, setContratDureeTravailHebdoMinutes] = useRecoilState(
    contratAtoms.cerfaContratDureeTravailHebdoMinutesAtom
  );
  const [contratTravailRisque, setContratTravailRisque] = useRecoilState(contratAtoms.cerfaContratTravailRisqueAtom);
  const [contratSalaireEmbauche, setContratSalaireEmbauche] = useRecoilState(
    contratAtoms.cerfaContratSalaireEmbaucheAtom
  );
  const [contratCaisseRetraiteComplementaire, setContratCaisseRetraiteComplementaire] = useRecoilState(
    contratAtoms.cerfaContratCaisseRetraiteComplementaireAtom
  );
  const [contratAvantageNature, setContratAvantageNature] = useRecoilState(contratAtoms.cerfaContratAvantageNatureAtom);
  const [contratAvantageNourriture, setContratAvantageNourriture] = useRecoilState(
    contratAtoms.cerfaContratAvantageNourritureAtom
  );
  const [contratAvantageLogement, setContratAvantageLogement] = useRecoilState(
    contratAtoms.cerfaContratAvantageLogementAtom
  );
  const [contratAutreAvantageEnNature, setContratAutreAvantageEnNature] = useRecoilState(
    contratAtoms.cerfaContratAutreAvantageEnNatureAtom
  );

  const [contratRemunerationsAnnuelles11DateDebut, setContratRemunerationsAnnuelles11DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11DateDebutAtom
  );
  const [contratRemunerationsAnnuelles11DateFin, setContratRemunerationsAnnuelles11DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11DateFinAtom
  );
  const [contratRemunerationsAnnuelles11Taux, setContratRemunerationsAnnuelles11Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11TauxAtom
  );
  const [contratRemunerationsAnnuelles11TypeSalaire, setContratRemunerationsAnnuelles11TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles11TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles12DateDebut, setContratRemunerationsAnnuelles12DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12DateDebutAtom
  );
  const [contratRemunerationsAnnuelles12DateFin, setContratRemunerationsAnnuelles12DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12DateFinAtom
  );
  const [contratRemunerationsAnnuelles12Taux, setContratRemunerationsAnnuelles12Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12TauxAtom
  );
  const [contratRemunerationsAnnuelles12TypeSalaire, setContratRemunerationsAnnuelles12TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles12TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles21DateDebut, setContratRemunerationsAnnuelles21DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21DateDebutAtom
  );
  const [contratRemunerationsAnnuelles21DateFin, setContratRemunerationsAnnuelles21DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21DateFinAtom
  );
  const [contratRemunerationsAnnuelles21Taux, setContratRemunerationsAnnuelles21Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21TauxAtom
  );
  const [contratRemunerationsAnnuelles21TypeSalaire, setContratRemunerationsAnnuelles21TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles21TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles22DateDebut, setContratRemunerationsAnnuelles22DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22DateDebutAtom
  );
  const [contratRemunerationsAnnuelles22DateFin, setContratRemunerationsAnnuelles22DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22DateFinAtom
  );
  const [contratRemunerationsAnnuelles22Taux, setContratRemunerationsAnnuelles22Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22TauxAtom
  );
  const [contratRemunerationsAnnuelles22TypeSalaire, setContratRemunerationsAnnuelles22TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles22TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles31DateDebut, setContratRemunerationsAnnuelles31DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31DateDebutAtom
  );
  const [contratRemunerationsAnnuelles31DateFin, setContratRemunerationsAnnuelles31DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31DateFinAtom
  );
  const [contratRemunerationsAnnuelles31Taux, setContratRemunerationsAnnuelles31Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31TauxAtom
  );
  const [contratRemunerationsAnnuelles31TypeSalaire, setContratRemunerationsAnnuelles31TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles31TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles32DateDebut, setContratRemunerationsAnnuelles32DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32DateDebutAtom
  );
  const [contratRemunerationsAnnuelles32DateFin, setContratRemunerationsAnnuelles32DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32DateFinAtom
  );
  const [contratRemunerationsAnnuelles32Taux, setContratRemunerationsAnnuelles32Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32TauxAtom
  );
  const [contratRemunerationsAnnuelles32TypeSalaire, setContratRemunerationsAnnuelles32TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles32TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles41DateDebut, setContratRemunerationsAnnuelles41DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41DateDebutAtom
  );
  const [contratRemunerationsAnnuelles41DateFin, setContratRemunerationsAnnuelles41DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41DateFinAtom
  );
  const [contratRemunerationsAnnuelles41Taux, setContratRemunerationsAnnuelles41Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41TauxAtom
  );
  const [contratRemunerationsAnnuelles41TypeSalaire, setContratRemunerationsAnnuelles41TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles41TypeSalaireAtom
  );
  const [contratRemunerationsAnnuelles42DateDebut, setContratRemunerationsAnnuelles42DateDebut] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42DateDebutAtom
  );
  const [contratRemunerationsAnnuelles42DateFin, setContratRemunerationsAnnuelles42DateFin] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42DateFinAtom
  );
  const [contratRemunerationsAnnuelles42Taux, setContratRemunerationsAnnuelles42Taux] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42TauxAtom
  );
  const [contratRemunerationsAnnuelles42TypeSalaire, setContratRemunerationsAnnuelles42TypeSalaire] = useRecoilState(
    contratAtoms.cerfaContratRemunerationsAnnuelles42TypeSalaireAtom
  );

  const onSubmittedContratAvantageNature = useCallback(
    async (path, data) => {
      try {
        if (path === "contrat.avantageNature") {
          const newV = {
            contrat: {
              avantageNature: {
                ...contratAvantageNature,
                value: data,
              },
            },
          };
          if (contratAvantageNature.value !== newV.contrat.avantageNature.value) {
            setContratAvantageNature(newV.contrat.avantageNature);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [contratAvantageNature, setContratAvantageNature]
  );

  const setAll = async (res) => {
    setContratModeContractuel(res.contrat.modeContractuel);
    setContratTypeContratApp(res.contrat.typeContratApp);
    setContratNumeroContratPrecedent(res.contrat.numeroContratPrecedent);
    setContratNoContrat(res.contrat.noContrat);
    setContratNoAvenant(res.contrat.noAvenant);
    setContratDateDebutContrat(res.contrat.dateDebutContrat);
    setContratDateEffetAvenant(res.contrat.dateEffetAvenant);
    setContratDateConclusion(res.contrat.dateConclusion);
    setContratDateFinContrat(res.contrat.dateFinContrat);
    setContratDateRupture(res.contrat.dateRupture);
    setContratLieuSignatureContrat(res.contrat.lieuSignatureContrat);
    setContratTypeDerogation(res.contrat.typeDerogation);
    setContratDureeTravailHebdoHeures(res.contrat.dureeTravailHebdoHeures);
    setContratDureeTravailHebdoMinutes(res.contrat.dureeTravailHebdoMinutes);
    setContratTravailRisque(res.contrat.travailRisque);
    setContratSalaireEmbauche(res.contrat.salaireEmbauche);
    setContratCaisseRetraiteComplementaire(res.contrat.caisseRetraiteComplementaire);
    setContratAvantageNature(res.contrat.avantageNature);
    setContratAvantageNourriture(res.contrat.avantageNourriture);
    setContratAvantageLogement(res.contrat.avantageLogement);
    setContratAutreAvantageEnNature(res.contrat.autreAvantageEnNature);

    for (let index = 0; index < res.contrat.remunerationsAnnuelles.length; index++) {
      const remunerationsAnnuelles = res.contrat.remunerationsAnnuelles[index];
      switch (remunerationsAnnuelles.ordre.value) {
        case "1.1":
          setContratRemunerationsAnnuelles11DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles11DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles11Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles11TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;
        case "1.2":
          setContratRemunerationsAnnuelles12DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles12DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles12Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles12TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;

        case "2.1":
          setContratRemunerationsAnnuelles21DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles21DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles21Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles21TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;
        case "2.2":
          setContratRemunerationsAnnuelles22DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles22DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles22Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles22TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;

        case "3.1":
          setContratRemunerationsAnnuelles31DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles31DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles31Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles31TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;
        case "3.2":
          setContratRemunerationsAnnuelles32DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles32DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles32Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles32TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;

        case "4.1":
          setContratRemunerationsAnnuelles41DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles41DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles41Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles41TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;
        case "4.2":
          setContratRemunerationsAnnuelles42DateDebut(remunerationsAnnuelles.dateDebut);
          setContratRemunerationsAnnuelles42DateFin(remunerationsAnnuelles.dateFin);
          setContratRemunerationsAnnuelles42Taux(remunerationsAnnuelles.taux);
          setContratRemunerationsAnnuelles42TypeSalaire(remunerationsAnnuelles.typeSalaire);
          break;

        default:
          break;
      }
    }
  };

  return {
    get: {
      contrat: {
        modeContractuel: contratModeContractuel,
        typeContratApp: contratTypeContratApp,
        numeroContratPrecedent: contratNumeroContratPrecedent,
        noContrat: contratNoContrat,
        noAvenant: contratNoAvenant,
        dateDebutContrat: contratDateDebutContrat,
        dateEffetAvenant: contratDateEffetAvenant,
        dateConclusion: contratDateConclusion,
        dateFinContrat: contratDateFinContrat,
        dateRupture: contratDateRupture,
        lieuSignatureContrat: contratLieuSignatureContrat,
        typeDerogation: contratTypeDerogation,
        dureeTravailHebdoHeures: contratDureeTravailHebdoHeures,
        dureeTravailHebdoMinutes: contratDureeTravailHebdoMinutes,
        travailRisque: contratTravailRisque,
        salaireEmbauche: contratSalaireEmbauche,
        caisseRetraiteComplementaire: contratCaisseRetraiteComplementaire,
        avantageNature: contratAvantageNature,
        avantageNourriture: contratAvantageNourriture,
        avantageLogement: contratAvantageLogement,
        autreAvantageEnNature: contratAutreAvantageEnNature,
        remunerationsAnnuelles: [
          {
            dateDebut: contratRemunerationsAnnuelles11DateDebut,
            dateFin: contratRemunerationsAnnuelles11DateFin,
            taux: contratRemunerationsAnnuelles11Taux,
            typeSalaire: contratRemunerationsAnnuelles11TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles12DateDebut,
            dateFin: contratRemunerationsAnnuelles12DateFin,
            taux: contratRemunerationsAnnuelles12Taux,
            typeSalaire: contratRemunerationsAnnuelles12TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles21DateDebut,
            dateFin: contratRemunerationsAnnuelles21DateFin,
            taux: contratRemunerationsAnnuelles21Taux,
            typeSalaire: contratRemunerationsAnnuelles21TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles22DateDebut,
            dateFin: contratRemunerationsAnnuelles22DateFin,
            taux: contratRemunerationsAnnuelles22Taux,
            typeSalaire: contratRemunerationsAnnuelles22TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles31DateDebut,
            dateFin: contratRemunerationsAnnuelles31DateFin,
            taux: contratRemunerationsAnnuelles31Taux,
            typeSalaire: contratRemunerationsAnnuelles31TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles32DateDebut,
            dateFin: contratRemunerationsAnnuelles32DateFin,
            taux: contratRemunerationsAnnuelles32Taux,
            typeSalaire: contratRemunerationsAnnuelles32TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles41DateDebut,
            dateFin: contratRemunerationsAnnuelles41DateFin,
            taux: contratRemunerationsAnnuelles41Taux,
            typeSalaire: contratRemunerationsAnnuelles41TypeSalaire,
          },
          {
            dateDebut: contratRemunerationsAnnuelles42DateDebut,
            dateFin: contratRemunerationsAnnuelles42DateFin,
            taux: contratRemunerationsAnnuelles42Taux,
            typeSalaire: contratRemunerationsAnnuelles42TypeSalaire,
          },
        ],
      },
    },
    setAll,
    onSubmit: {
      contrat: {
        avantageNature: onSubmittedContratAvantageNature,
      },
    },
  };
}

import React from "react";
import { Badge, Text, Center } from "@chakra-ui/react";
import { InfoCircle, Cloud, Processing, RejectIcon, Question } from "../../theme/components/icons/index";
import { DOSSIER_STATUS } from "../../common/constants/status";

const Icon = ({ variant }) => {
  switch (variant) {
    case "published":
      return <Cloud />;
    case "pending":
      return <Processing />;
    case "reject":
      return <RejectIcon />;
    case "nonConforme":
      return <RejectIcon />;
    case "unknown":
      return <Question />;
    case "conforme":
      return <InfoCircle />;
    default:
      return <InfoCircle />;
  }
};

export const StatusBadge = ({ status, text, withIcon = false, ...badgeProps }) => {
  const defaultVariant = "draft";
  const variantsMap = {
    BROUILLON: "draft", //  text: "Brouillon",
    DOSSIER_FINALISE_EN_ATTENTE_ACTION: "waitingSignature", //  text: "En cours de signature",
    EN_ATTENTE_DECLENCHEMENT_SIGNATURES: "waitingSignature", //  text: "En cours de signature",
    EN_ATTENTE_SIGNATURE: "waitingSignature", //  text: "En attente de signature",
    EN_ATTENTE_SIGNATURES: "waitingSignature", // text: "En cours de signature",
    SIGNATURES_EN_COURS: "waitingSignature", //text: "En cours de signature",
    SIGNATURES_REFUS: "signaturesRefused", // text: Signature refusée,
    SIGNE: "sign", //  text: "Signé",
    REFUS: "refus", // text: "Refusé",
    DOSSIER_TERMINE_AVEC_SIGNATURE: "aTeletransmettre", //   text: "À télétransmettre",
    DOSSIER_TERMINE_SANS_SIGNATURE: "aTeletransmettre", //   text: "À télétransmettre",
    TRANSMIS: "draft", //  text: "Transmis",
    EN_COURS_INSTRUCTION: "draft", // text: "En cours d'instruction",
    INCOMPLET: "nonConforme", // text: "À modifier",
    DEPOSE: "published", //  text: "Validé",
    REFUSE: "nonConforme", // text: "Non déposable",
    ENGAGE: "draft", //  text: "Contrat en cours",
    ANNULE: "unknown", //  text: "Annulé",
    RUTPURE: "unknown", //  text: "Rupture",
    SOLDE: "termine", // text: "Terminé",
  };

  const variant = variantsMap[status] ?? defaultVariant;

  return (
    <Badge variant={variant} {...badgeProps}>
      <Center>
        {withIcon && <Icon variant={variant} />}
        <Text {...(withIcon && { ml: 1, as: "span", whiteSpace: "break-spaces" })}>
          {text ? `${text}` : DOSSIER_STATUS[status]?.text}
        </Text>
      </Center>
    </Badge>
  );
};

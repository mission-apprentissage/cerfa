import React from "react";
import { Badge, Text, Center } from "@chakra-ui/react";
import { InfoCircle, Cloud, Processing, RejectIcon, Question } from "../../theme/components/icons/index";
import { DOSSIER_STATUS } from "../constants/status";

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
    BROUILLON: "draft",
    DOSSIER_FINALISE_EN_ATTENTE_ACTION: "waitingSignature",
    EN_ATTENTE_DECLENCHEMENT_SIGNATURES: "waitingSignature",
    EN_ATTENTE_SIGNATURE: "waitingSignature",
    EN_ATTENTE_SIGNATURES: "waitingSignature",
    SIGNATURES_EN_COURS: "waitingSignature",
    SIGNE: "sign",
    DOSSIER_TERMINE: "termine", // TODO MIGRATION SCRIPT
    DOSSIER_TERMINE_AVEC_SIGNATURE: "termine",
    DOSSIER_TERMINE_SANS_SIGNATURE: "termine",
    TRANSMIS: "waitingSignature",
    EN_COURS_INSTRUCTION: "pending",
    INCOMPLET: "nonConforme",
    DEPOSE: "published",
    REFUSE: "reject",
    ENGAGE: "conforme",
    ANNULE: "unknown",
    RUTPURE: "unknown",
    SOLDE: "unknown",
  };

  const variant = variantsMap[status] ?? defaultVariant;

  return (
    <Badge variant={variant} {...badgeProps}>
      <Center>
        {withIcon && <Icon variant={variant} />}
        <Text {...(withIcon && { ml: 1, as: "span", whiteSpace: "break-spaces" })}>
          {text ? `${text}` : DOSSIER_STATUS[status].text}
        </Text>
      </Center>
    </Badge>
  );
};

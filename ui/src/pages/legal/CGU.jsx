import React, { useEffect } from "react";
import { Box, Container, Heading, Text, Link } from "@chakra-ui/react";
import { Breadcrumb } from "../../common/components/Breadcrumb";
import Layout from "../layout/Layout";
import { setTitle } from "../../common/utils/pageUtils";
import { ExternalLinkLine } from "../../theme/components/icons";

export const cguVersion = () => {
  return "v1.0";
};

export const Cgu = ({ onLoad = () => {} }) => {
  useEffect(() => {
    onLoad();
  }, [onLoad]);
  return (
    <Box>
      <Text>Dernière mise à jour le : 18/01/2022 - {cguVersion()} </Text>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          1. PRÉAMBULE
        </Heading>
        <Text>
          La Plateforme de digitalisation (ci-après « la Plateforme ») répond à une mission de service public consistant
          à permettre de créer et remplir en ligne un contrat d'apprentissage. La Plateforme est créée et administrée
          par la Délégation générale à l&#39;Emploi et à la Formation professionnelle du ministère du Travail (ci-après
          la DGEFP)
          <br />
          <br />
        </Text>
        <Text>
          L'utilisateur ne peut bénéficier des services proposés par la Plateforme que sous réserve de l'acceptation des
          présentes conditions générales.
          <br />
          <br />
        </Text>
        <Text>
          L'utilisateur reconnaît que l'utilisation du service nécessite le respect de l'ensemble des dispositions des
          présentes.
          <br />
          <br />
        </Text>
        <Text>
          L'utilisateur reconnaît disposer de la compétence et des moyens nécessaires pour accéder et utiliser ce
          service.
          <br />
          <br />
        </Text>
        <Text>
          L'utilisateur dispose de la faculté de sauvegarder et d'imprimer les présentes conditions générales
          d'utilisation en utilisant les fonctionnalités standard de son navigateur ou de son ordinateur.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          2. DÉFINITIONS
        </Heading>
        <Text>
          Les termes ci-dessous définis ont entre les parties la signification suivante :
          <br />
          <br />
        </Text>
        <Text>
          <strong>« Utilisateur »</strong> : toute personne ayant accès à aux services de la Plateforme
          <br />
          <br />
        </Text>
        <Text>
          <strong>« CFA »</strong> : Centre de formation d'apprentis.
          <br />
          <br />
        </Text>
        <Text>
          <strong>« Authentification »</strong> : fonctionnalité qui permet aux utilisateurs titulaires d'un compte
          d'accéder aux services proposés par le Ministère sur la plateforme
          <br />
          <br />
        </Text>
        <Text>
          <strong>« Employeur public »</strong> : Personnes morale de droit public dont le personnel ne relève pas du
          droit privé pouvant conclure des contrats d'apprentissage. Les organismes publics ne disposant pas de la
          personnalité morale peuvent, sous réserve d'avoir la capacité juridique de recruter des personnels, conclure
          des contrats d'apprentissage dans les mêmes conditions que celles prévues au premier alinéa.
          <br />
          <br />
        </Text>
        <Text>
          <strong>« Supports »</strong> : personnes accompagnant les utilisateurs dans la création et complétude de leur
          CERFA.
          <br />
          <br />
        </Text>
        <Text>
          <strong>« Gestionnaire</strong> » : utilisateur disposant de la compétence pour instruire ou contrôler les
          informations liées à la démarche administrative associée au service utilisé.
          <br />
          <br />
        </Text>
        <Text>
          <strong>« Service »</strong> : ensemble des prestations proposées par le Ministère via la Plateforme. Elles
          sont les suivantes : création d'un compte utilisateur, création d'un CERFA apprentissage, envoi du CERFA
          dématérialisé pour validation, complétude du dossier par ajout de pièces justificatives.
          <br />
          <br />
        </Text>
        <Text>
          <strong>« Plateforme »</strong>: plateforme est un service en ligne permettant aux centre de formations
          d'apprentis et employeurs public de déposer de manière dématérialisé les contrats d'apprentissage du secteur
          public.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          3. OBJET
        </Heading>
        <Text>
          Les présentes conditions générales ont pour objet de définir les modalités d'utilisation des services proposés
          par la Plateforme. Elles sont un accord juridique et contraignant entre la DGEFP et les utilisateurs des
          services.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          4. OPPOSABILITÉ
        </Heading>
        <Text>
          Les présentes conditions générales sont opposables à l'utilisateur dès leur acceptation par ce dernier.
          <br />
          <br />
          Elles seront présentées auprès de l'utilisateur à l'issue de sa première authentification sur la plateforme.
          <br />
          <br />
          Dans tous les cas, les présentes conditions générales sont réputées lues et applicables à la date de la
          visualisation des présentes par l'utilisateur habilité.
          <br />
          <br />
          Le Ministère se réserve le droit d'apporter aux présentes conditions générales toutes les modifications ou
          suppressions qu'il jugera nécessaire et utile.
          <br />
          <br />
          Les présentes conditions générales d'utilisation sont opposables pendant toute la durée d'utilisation du
          service et jusqu'à ce que de nouvelles conditions générales d'utilisation remplacent les présentes.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          5. DURÉE - ENTRÉE EN VIGUEUR
        </Heading>
        <Text>
          Les présentes conditions générales d'utilisation entrent en vigueur à compter de leur date de mise en ligne
          sur la Plateforme.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          6. GESTION DU COMPTE DES UTILISATEURS
        </Heading>
        <Text>
          L'accès aux fonctionnalités de la plateforme est restreint à une inscription au Portail de service ({" "}
          <Link href={"https://mesdemarches.emploi.gouv.fr"} textDecoration={"underline"} isExternal>
            https://mesdemarches.emploi.gouv.fr
            <ExternalLinkLine w={"0.75rem"} h={"0.75rem"} mb={"0.125rem"} />
          </Link>
          ) : les services proposés ne sont accessibles qu'aux seuls utilisateurs munis d'un identifiant
          d'authentification et d'un mot de passe.
          <br />
          <br />
          La procédure de création de compte permet aux utilisateurs de se créer un compte associé à leur type de profil
          et d'accéder aux fonctionnalités de démarches administratives.
          <br />
          <br />
          L'utilisateur est titulaire d'un compte personnel, accessible par son identifiant personnel et par un mot de
          passe dès lors que toutes les formalités nécessaires à son inscription sont accomplies.
          <br />
          <br />
          Un seul compte peut être attribué par utilisateur (même adresse électronique).
          <br />
          <br />
          Le mot de passe est strictement personnel et confidentiel. Il contient au moins 12 caractères comprenant
          majuscules, minuscules, chiffres, et caractères spéciaux.
          <br />
          <br />
          L'utilisateur est seul responsable de la préservation et de la confidentialité de son mot de passe et autres
          données confidentielles qui lui seraient éventuellement transmises par le Ministère.
          <br />
          <br />
          L'utilisateur est responsable de la sincérité des informations qu'il fournit et s'engage à mettre à jour les
          informations le concernant ou à aviser la DGEFP sans délai de toute modification affectant sa situation.
          <br />
          <br />
          En cas d'utilisation frauduleuse de son compte ou vol de son mot de passe, l'utilisateur s'engage à prévenir
          immédiatement le Ministère et à modifier sans délai son mot de passe d'accès.
          <br />
          <br />
          Cette notification devra être adressée au Ministère par courrier électronique à l'adresse :
          misi.dgefp@emploi.gouv.fr. La date de réception de ce courrier électronique fera foi entre les parties.
          <br />
          <br />
          En cas d'oubli de son mot de passe ou de compromission, l'utilisateur utilise la fonctionnalité « oubli de mot
          de passe » et suit les instructions fournies par le portail de service.
          <br />
          <br />
          La procédure de création de compte nécessite la fourniture de données personnelles. Ces données sont traitées
          conformément aux dispositions de la Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et
          aux libertés, dans sa version en vigueur, ainsi qu'aux Règlement Général sur les Données Personnelles (RGPD).
          <br />
          <br />
          Pour plus d'information, veuillez-vous rendre sur notre politique de confidentialité « insérer URL politique
          de confidentialité de la Plateforme »
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          7. PRÉSENTATION DES SERVICES
        </Heading>
        <Text>
          Les services de la plateforme répondent à une mission de service public liée à l'apprentissage des employeurs
          publics
          <br />
          <br />
          La plateforme mise à la disposition par le Ministère du travail permet aux utilisateurs :
          <br />
          <br />
          Cette plateforme permet la saisie en ligne des contrats d'apprentissage pour les employeurs publics.
          <br />
          <br />
          En tant qu'employeur public, relevant donc de la fonction publique d'Etat, de la fonction publique
          territoriale ou de la fonction publique hospitalière, l'utilisateur peut générer le cerfa du contrat
          d'apprentissage.
          <br />
          <br />
          L'outil propose pour cela le pré-remplissage d'éléments attendus et effectue des contrôles de cohérence et
          réglementaires de la donnée saisie.
          <br />
          <br />
          Cette saisie en ligne est complétée du dépôt des documents mentionnés à l'article D 6275-1 afin de pouvoir
          transmettre un dossier complet auprès du représentant de l'Etat dans le département du lieu d'exécution du
          contrat dont il dépend : DR(I)EETS, DDETS, DEETS, DGCOPOP pour le dépôt du contrat.
          <br />
          <br />
          Un service de signature électronique est proposé, basé sur la solution Yousign afin de permettre aux parties
          prenantes du contrat la signature du document complété
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          8. ACCÈS A LA PLATEFORME
        </Heading>
        <Text>
          La Plateforme est, en principe, accessible en permanence.
          <br />
          <br />
          Le Ministère se réserve le droit, sans préavis, ni indemnité, de fermer temporairement l'accès à un ou
          plusieurs services de la Plateforme pour effectuer une mise à jour, des modifications ou changement sur les
          méthodes opérationnelles, les serveurs et les heures d'accessibilité. Cette liste n'est pas limitative.
          <br />
          <br />
          Dans ce cas, le Ministère peut indiquer une date de réouverture du compte ou d'accessibilité à un ou plusieurs
          services.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          9. SÉCURITÉ
        </Heading>
        <Text>
          La plateforme et, notamment, le service, est un système de traitement automatisé de données. Tout accès ou
          maintien frauduleux à ce dernier est interdit et sanctionné pénalement. Il en est de même pour toute entrave
          ou altération du fonctionnement de ce système, ou en cas d'introduction, de suppression ou de modification des
          données qui y sont contenues.
          <br />
          <br />
          L'utilisateur s'engage à ne pas perturber le bon fonctionnement de ce système. Il veille notamment à ne pas
          introduire de virus ou toute autre technologie nuisible à la plateforme aux services qui y sont proposés, ou
          au Ministère.
          <br />
          <br />
          Le Ministère fait ses meilleurs efforts, conformément aux règles de l'art, pour sécuriser le service eu égard
          à la complexité de l'internet. Il ne saurait assurer une sécurité absolue.
          <br />
          <br />
          L'utilisateur déclare accepter les caractéristiques et limites de l'internet.
          <br />
          <br />
          Il reconnaît avoir connaissance de la nature du réseau de l'internet, et en particulier, de ses performances
          techniques et des temps de réponse pour consulter, interroger ou transférer les données d'informations.
          <br />
          <br />
          L'utilisateur informe le Ministère de toute défaillance du service.
          <br />
          <br />
          L'utilisateur a conscience que les données circulant sur l'internet ne sont pas nécessairement protégées,
          notamment contre les détournements éventuels.
          <br />
          <br />
          L'utilisateur accepte de prendre toutes les mesures appropriées de façon à protéger ses propres données ou
          logiciels de la contamination par des éventuels virus sur le réseau de l'internet.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          10. HYPERLIENS
        </Heading>
        <Text>
          Le Ministère se réserve la possibilité de mettre en place des hyperliens sur sa plateforme donnant accès à des
          pages internet autres que celles de sa plateforme.
          <br />
          <br />
          Les liens hypertextes mis en place dans le cadre de la plateforme en direction d'autres ressources présentes
          sur le réseau Internet, et notamment vers ses partenaires, ont fait l'objet d'une autorisation préalable,
          écrite et expresse.
          <br />
          <br />
          Les utilisateurs sont formellement informés que les sites auxquels ils peuvent accéder par l'intermédiaire des
          liens hypertextes n'appartiennent pas tous au Ministère.
          <br />
          <br />
          Le Ministère ne saurait être responsable de l'accès par les utilisateurs par les liens hypertextes mis en
          place dans le cadre de la plateforme à d'autres ressources présentes sur le réseau.
          <br />
          <br />
          Le Ministère décline toute responsabilité quant au contenu des informations fournies sur ces ressources
          présentes sur le réseau au titre de l'activation des liens hypertextes.
          <br />
          <br />
          La mise en place d'un hyperlien en direction de la plateforme « URL Plateforme de digitalisation », est
          interdite à défaut de l'autorisation expresse et préalable du Ministère. Il est, en tout état de cause,
          interdit d'imbriquer les pages de la plateforme à l'intérieur des pages d'un autre site.
          <br />
          <br />
          En toute hypothèse, les liens hypertextes renvoyant au site web devront être retirés à première demande du
          Ministère.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          11. RESPONSABILITÉ
        </Heading>
        <Heading as={"h3"} textStyle="h6" mb={5} fontSize="2xl">
          11.1 Limites de la responsabilité du ministère
        </Heading>
        <Text>
          Le Ministère ne saurait être tenu pour responsable des conséquences provoquées par le caractère erroné ou
          frauduleux des informations fournies par l'utilisateur.
          <br />
          <br />
          L'utilisateur reste en toutes circonstances responsable de l'utilisation qu'il fait des services de la
          plateforme.
          <br />
          <br />
          Le Ministère ne saurait être responsable de l'impossibilité d'utiliser la plateforme et les services.
          <br />
          <br />
          Le Ministère ne saurait être responsable des atteintes à la sécurité informatique pouvant causer des dommages
          aux matériels informatiques des utilisateurs et à leurs données.
          <br />
          <br />
          Le Ministère ne peut être tenu pour responsable en cas de perte ou de dommage quant au stockage de tout
          message ou de tout autre contenu diffusé ou transmis via la plateforme.
          <br />
          <br />
          Le Ministère n'est pas responsable des conditions d'utilisation du service par les utilisateurs ni des
          relations entre les utilisateurs.
          <br />
          <br />
          Sans limiter la portée des autres dispositions des présentes conditions générales d'utilisation, le Ministère
          ne peut, notamment, être considéré comme responsable des dommages résultant de l'utilisation du service, de
          l'attitude, de la conduite ou du comportement d'un autre utilisateur.
          <br />
          <br />
          Sans limiter la portée des autres dispositions des présentes conditions générales d'utilisation, la
          responsabilité du Ministère, qu'elle soit délictuelle ou contractuelle, ne peut être engagée pour des faits
          dus à un cas de force majeure, un cas fortuit ou au fait d'un tiers ou de la victime du dommage.
          <br />
          <br />
          Les parties reconnaissent que constituent notamment un cas fortuit les pannes et les problèmes d'ordre
          technique concernant le matériel, les programmes et logiciels informatiques ou le réseau Internet y compris,
          mais ne se limitant pas aux interruptions, suspension ou fermeture du service.
          <br />
          <br />
          La responsabilité du Ministère ne saurait être recherchée en cas d'usage frauduleux ou abusif ou, à la suite
          d'une divulgation volontaire ou involontaire, à quiconque, des codes d'accès confiés à l'utilisateur.
          <br />
          <br />
          Sauf faute ou négligence prouvée du Ministère, les atteintes à la confidentialité des données personnelles de
          l'utilisateur résultant de l'utilisation de son identifiant et de son mot de passe par un tiers ne sauraient
          engager la responsabilité du Ministère.
          <br />
          <br />
          La responsabilité du Ministère ne peut être engagée en cas de dommages directs ou indirects résultant de
          l'utilisation de la Plateforme.
          <br />
          <br />
          Le Ministère ne saurait être responsable de l'atteinte aux droits des utilisateurs de manière générale.
          <br />
          <br />
          La responsabilité du Ministère ne pourra être recherchée ni retenue en cas d'indisponibilité temporaire ou
          totale de tout ou partie de l'accès à la plateforme, d'une difficulté liée au temps de réponse et d'une
          manière générale, d'un défaut de performance quelconque.
          <br />
          <br />
        </Text>
        <Heading as={"h3"} textStyle="h6" mb={5} fontSize="2xl" mt={3}>
          11.2 Responsabilité des utilisateurs
        </Heading>
        <Text>
          L'utilisateur s'engage à utiliser la plateforme et les services, ainsi que l'ensemble des informations
          auxquelles il pourra avoir accès en conformité avec les stipulations des présentes conditions générales
          d'utilisation.
          <br />
          <br />
          L'utilisateur s'engage à ne pas perturber l'usage que pourraient faire les autres utilisateurs de la
          Plateforme, de ne pas accéder aux comptes membre tiers et de ne pas accéder à des parties de la plateforme
          dont l'accès est réservé.
          <br />
          <br />
          L'utilisateur s'engage à utiliser le service ainsi que l'ensemble des informations auxquelles il pourra avoir
          accès, dans un but conforme à l'ordre public, aux bonnes mœurs et aux droits des tiers.
          <br />
          <br />
          L'utilisateur s'engage à ne commettre aucun acte pouvant mettre en cause la sécurité informatique du Ministère
          ou des autres utilisateurs.
          <br />
          <br />
          L'utilisateur s'engage à ne pas interférer ou interrompre le fonctionnement normal de la plateforme.
          <br />
          <br />
          L'utilisateur s'engage à ne pas collecter, utiliser, ou effectuer un traitement quelconque des données
          personnelles des autres utilisateurs.
          <br />
          <br />
          Les utilisateurs sont responsables de l'utilisation du de la plateforme, de leurs actes et doivent respecter
          les règles des présentes conditions générales d'utilisation en agissant de manière compatible avec le service
          et les législations et réglementations en vigueur.
          <br />
          <br />
          Toute autre utilisation donne droit au Ministère de fermer l'accès au service de l'utilisateur, de supprimer
          les données et fichiers y figurant, de supprimer l'accès à ses données ou fichiers, ou d'interdire à
          l'utilisateur l'accès de tout ou partie du service, et ce sans préjudice de tous dommages-intérêts auxquels le
          Ministère pourrait prétendre.
          <br />
          <br />
          Toute utilisation des Services susceptible d'endommager, de désactiver, de surcharger l'infrastructure de la
          Plateforme ou encore d'entraver la jouissance des Services par les autres Utilisateurs est interdite.
          <br />
          <br />
          Toute tentative d'accès non autorisé aux Services, à d'autres comptes, aux systèmes informatiques ou à
          d'autres réseaux connectés ou à l'un des Services via le piratage ou toute autre méthode est interdite.
          <br />
          <br />
          Toute utilisation des Services contraire à la règlementation applicable en matière de protection des données
          personnelles est interdite.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          12. PROPRIETÉ INTELLECTUELLE
        </Heading>
        <Text>
          L'utilisateur reconnaît et accepte que le contenu de la Plateforme et notamment mais non exclusivement les
          textes, marques, photographies, vidéos, logiciels et programmes, sons, musiques, mise en page, charte
          graphique, logos, logiciels, les bases de données, design ou toute autre information ou support présenté par
          le Ministère, sont protégés par leurs droits d'auteurs, marque, brevet et tout autre droit de propriété
          intellectuelle ou industrielle qui leur sont reconnus selon les lois en vigueur.
          <br />
          <br />
          Toute reproduction ou représentation, totale ou partielle d'un de ces droits, sans l'autorisation expresse du
          Ministère est interdite et constituerait une contrefaçon.
          <br />
          <br />
          En conséquence, l'utilisateur s'interdit tout agissement et tout acte susceptible de porter atteinte
          directement ou non aux droits de propriété intellectuelle du Ministère.
          <br />
          <br />
          L'utilisateur ne peut en aucun cas utiliser, imprimer ou reformater le contenu de la plateforme, sinon, pour
          les informations disponibles en accès libre, à des fins autres que privées ou familiales.
          <br />
          <br />
          Il s'engage notamment à ne pas télécharger, à l'exception des documents pour lesquels le téléchargement est
          proposé, reproduire, transmettre, vendre ou distribuer, le contenu du de la plateforme.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          13. PROTECTION DES DONNES PERSONNELLES
        </Heading>
        <Text>
          Les données sont traitées sur la plateforme conformément aux dispositions de la Loi n° 78-17 du 6 janvier 1978
          relative à l'informatique, aux fichiers et aux libertés, dans sa version en vigueur, ainsi qu'aux Règlement
          Général sur les Données Personnelles (RGPD).
          <br />
          <br />
          Dans le cas où l'utilisateur se voit proposé de compléter un champ libre, il s'interdit par principe d'y faire
          figurer toutes données sensibles.
          <br />
          <br />
          Pour plus d'information, veuillez-vous rendre sur notre politique de confidentialité « insérer URL politique
          de confidentialité de la Plateforme »
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          14. RÉSILIATION - RÉSOLUTION
        </Heading>
        <Text>
          En cas de manquement aux obligations des présentes, l'utilisateur ou le Ministère pourront prononcer de plein
          droit la résiliation ou la résolution des présentes sans préjudice de tous dommages et intérêts auxquels il
          pourrait prétendre en vertu des présentes.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          15. TRAÇABILITÉ
        </Heading>
        <Text>
          Le Ministère conserve l'historique des évènements des utilisateurs de la plateforme et des conditions
          générales d'utilisation successives, le cas échéant.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          16. NULLITÉ
        </Heading>
        <Text>
          Si une ou plusieurs stipulations des présentes sont tenues pour non valides ou déclarées comme telles en
          application d'une loi, d'un règlement ou à la suite d'une décision passée en force de chose jugée d'une
          juridiction compétente, les autres stipulations garderont toute leur force et leur portée.
          <br />
          <br />
        </Text>
      </Box>
      <Box mt={4}>
        <Heading as={"h3"} textStyle="h6" mb={5}>
          17. LOI APPLICABLE
        </Heading>
        <Text>
          Les présentes conditions générales sont régies par la loi française.
          <br />
          <br />
          Il en est ainsi pour les règles de fond et les règles de forme et ce, nonobstant les lieux d'exécution des
          obligations substantielles ou accessoires
          <br />
          <br />
        </Text>
      </Box>
    </Box>
  );
};

export const CguPage = () => {
  const title = "CONDITIONS GÉNÉRALES D'UTILISATION DE LA PLATEFORME";
  setTitle(title);

  return (
    <Layout>
      <Box w="100%" pt={[4, 8]} px={[1, 1, 12, 24]}>
        <Container maxW="xl">
          <Breadcrumb pages={[{ title: "Accueil", to: "/" }, { title: title }]} />
          <Heading textStyle="h2" color="grey.800" mt={5}>
            {title}
          </Heading>
          <Box pt={1} pb={16}>
            <Cgu />
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

[![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmission-apprentissage%2Fupptime%2Fmaster%2Fapi%2Fcerfa-publique%2Fuptime.json)](https://mission-apprentissage.github.io/upptime/history/cerfa-publique)
[![codecov](https://codecov.io/gh/mission-apprentissage/cerfa/branch/main/graph/badge.svg?token=PNKREEQN2Z)](https://codecov.io/gh/mission-apprentissage/cerfa)

![](https://avatars1.githubusercontent.com/u/63645182?s=200&v=4)

# Générateur de contrat publique en apprentissage

## Statuts

[Statuts de la plateforme](https://mission-apprentissage.github.io/upptime/history/cerfa-publique)
[Statuts API de la plateforme](https://mission-apprentissage.github.io/upptime/history/cerfa-publique-api)
[Statuts api entreprise](https://status.entreprise.api.gouv.fr/)

## Développement

### Pré-requis

- Docker 19+
- Docker-compose 1.27+

## Démarrage rapide

Avant de démarrer la stack il vous faut copier et renommer les fichier suivant :

```bash
cp ui/.env.example ui/.env
cp server/.env.example server/.env
```

Pour lancer l'application, vous pouvez exécuter les commandes suivantes :

```shell
make install
make start
```

L'application est ensuite disponible à l'url [http://localhost](http://localhost).

Il est possible de consulter les emails envoyés par l'application à
l'url [http://localhost/smtp](http://localhost/smtp)

### Hydratation du projet en local

Pour créer des jeux de test facilement il suffit de lancer les commandes suivante :

```bash
yarn --cwd server seed -e admin@mail.com
yarn --cwd server imports
```

## Développement

Pour plus d'informations sur la structure du projet [DEV](./DEV.md)

## Environnements

La plateforme est déployé sur deux environnements :

- [Recette](https://contrat-recette.apprentissage.beta.gouv.fr)
- [Production](https://contrat.apprentissage.beta.gouv.fr)

[![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fmission-apprentissage%2Fupptime%2Fmaster%2Fapi%2Fcerfa-publique%2Fuptime.json)](https://mission-apprentissage.github.io/upptime/history/cerfa-publique)
[![codecov](https://codecov.io/gh/mission-apprentissage/cerfa/branch/main/graph/badge.svg?token=PNKREEQN2Z)](https://codecov.io/gh/mission-apprentissage/cerfa)

![](https://avatars1.githubusercontent.com/u/63645182?s=200&v=4)

# Générateur de contrat publique en apprentissage

### Pré-requis

- Docker 19+
- Docker-compose 1.27+

## Démarrage rapide

Pour lancer l'application, vous pouvez exécuter les commandes suivantes :

```shell
make install
make start
```

L'application est ensuite disponible à l'url [http://localhost](http://localhost).

Il est possible de consulter les emails envoyés par l'application à
l'url [http://localhost/smtp](http://localhost/smtp)

## Développement

Pour plus d'informations sur la structure du projet [DEV](./DEV.md)

## Environnements

cerfa est déployé sur deux environnements :

- [Recette](https://cerfa-recette.apprentissage.beta.gouv.fr)
- [Production](https://cerfa.apprentissage.beta.gouv.fr)

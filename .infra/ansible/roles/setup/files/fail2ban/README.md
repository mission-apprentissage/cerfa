# Fail2Ban

Ce module permet la mise en place d'une politique de fail2ban sur le serveur déployé dans Azure.

_Plus d'informations ici : https://doc.ubuntu-fr.org/fail2ban_

## Configuration

Définie dans le dossier `jail.d` dans les fichiers :

- `nginx.local`
- `sshd.local`

## Filtres

On ajoute 2 moyens de détections dans le dossier `filter.d` dans les fichiers :

- `nginx-conn-limit.conf`
- `nginx-req-limit.conf`

## Actions - Notifications dans Slack

Défini dans le dossier `action.d`.

On ajoute une notification dans une channel Slack à chaque alerte, en précisant l'environnement concerné.
La configuration est faite dans le fichier `slack-notify.conf`.

Pour cela il faut spécifier le nom de la chaine Slack et ajouter l'URL du Webhook.

```sh
init = 'Sending notification to Slack'
slack_channel = <chaine_slack>
slack_webhook_url = <slack_app_webhook_url>
```

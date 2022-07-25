#!/usr/bin/env bash

cd "${0%/*}/../../../" || exit;

Help()
{
   echo "Push les images docker de CELIA sur le registry klee (https://registry.kleegroup.com/harbor)"
   echo
   echo "Utilisation : push-images.sh -v [numéro de version] -u [login] -p [password]"
   echo
}

while getopts ":v:u:p:" option; do
  case "${option}" in
    v)
        v=${OPTARG}
        ;;
    u)
        u=${OPTARG}
        ;;
    p)
        p=${OPTARG}
        ;;
    *)
       help
       ;;
  esac
done

if [ -z "$v" ] || [ -z "$u" ] || [ -z "$p" ]; then
  Help
  exit 1
fi

read -r -p "Confirmer le numéro de version $v ? [y/N] " response

case "$response" in
    [yY][eE][sS]|[yY])
        ;;
    *)
        exit
        ;;
esac

echo "Login sur le registry ..."
docker login registry.kleegroup.com -u "$u" -p "$p"
echo "Logged!"

# Pour enlever le message "Use 'docker scan' to run Snyk ..."
export DOCKER_SCAN_SUGGEST=false

echo "Création des images docker locales (docker build)"
echo "Build cerfa_ui:$v ..."
docker build ./ui -t registry.kleegroup.com/dgefp-pdigi/cerfa_ui:"$v"
echo "Building cerfa_server:$v ..."
docker build ./server -t registry.kleegroup.com/dgefp-pdigi/cerfa_server:"$v"

# On copie le fichier location_metabase.conf.template dans le dossier /reverse_proxy/app/nginx/templates/includes
# On doit faire ça parce que ce fichier ne doit exister que pour le build des images, pas pour le lancement local
cp ./.infra/cegedim/files/location_metabase.conf.template ./reverse_proxy/app/nginx/templates/includes/location_metabase.conf.template

echo "Building reverse_proxy:$v ..."
docker build ./reverse_proxy -t registry.kleegroup.com/dgefp-pdigi/cerfa_reverse_proxy:"$v"

# On supprime le fichier location_metabase.conf.template
rm ./reverse_proxy/app/nginx/templates/includes/location_metabase.conf.template

# L'enchainement de commande plante régulièrement => Le sleep 3 résoud en partie le problème
sleep 3
echo "Push des images locales sur le registry"
echo "Pushing cerfa_ui:$v ..."
docker push registry.kleegroup.com/dgefp-pdigi/cerfa_ui:"$v"
sleep 3
echo "Pushing cerfa_server:$v ..."
docker push registry.kleegroup.com/dgefp-pdigi/cerfa_server:"$v"
sleep 3
echo "Pushing cerfa_reverse_proxy:$v ..."
docker push registry.kleegroup.com/dgefp-pdigi/cerfa_reverse_proxy:"$v"

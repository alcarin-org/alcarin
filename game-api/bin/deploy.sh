#!/bin/sh

set -eux

HOST=3.12.119.33
REMOTE_WORKING_DIR="~/apollo-api"

printf "\n-- Building project\n\n"
# build project locally because on the server there is no enough RAM
npm run build

printf " -- Updating remote code\n\n"
rsync --delete -av -e ssh --exclude='./node_modules' --exclude '.env' . ubuntu@$HOST:$REMOTE_WORKING_DIR
rsync --delete -av -e ssh --exclude='./node_modules' --exclude '.env' ../common ubuntu@$HOST:"$REMOTE_WORKING_DIR/.."

ssh ubuntu@$HOST << EOF
    set -eux
    cd $REMOTE_WORKING_DIR
    printf " -- Installing dependencies\n\n"
    npm ci
    printf "\n\n -- Stopping services\n\n"
    pm2 stop all
    printf "\n\n -- Reloading processes\n\n"
    pm2 reload all pm2-apollo.config.yml --update-env
    pm2 save
EOF

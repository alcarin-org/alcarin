#!/bin/sh

set -eux

rm -rf ./dist

API_DIR="./dist/api"

mkdir -p $API_DIR

# copy static files
cp openapi.yml $API_DIR/
cp swagger.css $API_DIR/

echo "Compile common code.."

cd ../common/ && npm install && cd -
tsc --build ../common/tsconfig.prod.json --incremental
mkdir -p "$API_DIR/node_modules/@mailteam/common"
cp -r ../common/dist/* "$API_DIR/node_modules/@mailteam/common"

echo "Compile main API code.."
tsc --build tsconfig.prod.json --incremental

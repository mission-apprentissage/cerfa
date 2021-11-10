#!/bin/sh

echo
echo "$@"
echo "`jq '.version="1.0.0-beta.8"' ./ui/package.json`" > ./ui/package.json
echo
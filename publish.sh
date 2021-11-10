#!/bin/sh

echo
echo "`jq '.version="1.0.0-beta.7"' ./ui/package.json`" > ./ui/package.json
echo
exit 1
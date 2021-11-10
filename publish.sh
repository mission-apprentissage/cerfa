#!/bin/sh

echo
echo "`jq '.version="xxx"' ./ui/package.json`" > ./ui/package.json
echo
exit 1
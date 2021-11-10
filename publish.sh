#!/bin/sh

next_version="${1}"

echo ${next_version}
cd ./ui
npm version ${next_version}
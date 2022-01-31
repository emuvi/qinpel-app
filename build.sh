#!/bin/bash
bash -v clean.sh
npm install
tsc -p tsconfig.json

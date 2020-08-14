#!/bin/bash

rm -fr resolvr.zip
zip -r resolvr.zip . -x "build.sh" -x ".DS_Store" -x "__MACOSX" -x ".git" -x ".gitignore"

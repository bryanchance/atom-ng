#!/bin/bash

cd ./out/Atom-ng_1.66.9_amd64/ &&
ATOM_HOME="${PWD}/.atom" ./atom-ng $@

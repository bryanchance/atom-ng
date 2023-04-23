#!/bin/bash

cd ./out/atom-ng-1.66.9-amd64/ &&
ATOM_HOME="${PWD}/.atom" ./atom-ng $@

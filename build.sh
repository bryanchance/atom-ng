#!/bin/bash

sudo apt-get install build-essential git libsecret-1-dev fakeroot rpm libx11-dev libxkbfile-dev nodejs npm node-gyp node-istanbul &&

export ATOM_ELECTRON_URL='https://artifacts.electronjs.org/headers/dist' &&

./script/bootstrap &&

./script/build --create-debian-package --compress-artifacts

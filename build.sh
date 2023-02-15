#!/bin/bash

# Copyright(c) 2023 Alex313031

# Install prerequisites
sudo apt-get install build-essential git libsecret-1-dev fakeroot rpm libx11-dev libxkbfile-dev nodejs npm node-gyp node-istanbul &&

# Optimization parameters
export CFLAGS="-O3" &&
export CXXFLAGS="-O3" &&
export CPPFLAGS="-O3" &&
export LDFLAGS="-Wl,-O3" &&

# Use upstream electron
export ATOM_ELECTRON_URL='https://artifacts.electronjs.org/headers/dist' &&

# Workaround for jasmine
mkdir -p $HOME/.atom/.node-gyp &&
cp -v gitconfig $HOME/.atom/.node-gyp/.gitconfig &&

# Run final bootstrap
./script/bootstrap &&

# Build linux package and archive for distribution
./script/build --create-debian-package --compress-artifacts

exit 0

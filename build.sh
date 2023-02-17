#!/bin/bash

# Copyright(c) 2023 Alex313031

YEL='\033[1;33m' # Yellow
CYA='\033[1;96m' # Cyan
RED='\033[1;31m' # Red
GRE='\033[1;32m' # Green
c0='\033[0m' # Reset Text
bold='\033[1m' # Bold Text
underline='\033[4m' # Underline Text

# Error handling
yell() { echo "$0: $*" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "${RED}Failed $*"; }

# --help
displayHelp () {
	printf "\n" &&
	printf "${bold}${GRE}Script to build Atom-ng on Linux.${c0}\n" &&
	printf "${bold}${YEL}Use the --install-deps flag to install build dependencies.${c0}\n" &&
	printf "${bold}${YEL}Use the --help flag to show this help.${c0}\n" &&
	printf "\n"
}

# Install prerequisites
installDeps () {
	sudo apt-get install build-essential git libsecret-1-dev fakeroot rpm libx11-dev libxkbfile-dev nodejs npm node-gyp node-istanbul
}

case $1 in
	--help) displayHelp; exit 0;;
esac

case $1 in
	--install-deps) installDeps; exit 0;;
esac

# Optimization parameters
export CFLAGS="-O3 -Wno-deprecated-declarations" &&
export CXXFLAGS="-O3 -Wno-deprecated-declarations" &&
export CPPFLAGS="-O3 -Wno-deprecated-declarations" &&
export LDFLAGS="-Wl,-O3" &&

# Use upstream electron
# export ATOM_ELECTRON_URL='https://artifacts.electronjs.org/headers/dist' &&

# Workaround for jasmine
mkdir -v -p $HOME/.atom/.node-gyp &&
cp -v gitconfig $HOME/.atom/.node-gyp/.gitconfig &&
printf "${bold}${GRE} > Building Atom-ng for Linux...\n" &&
printf "\n" &&

# Run final bootstrap
./script/bootstrap &&

# Build linux package and archive for distribution
./script/build $@

exit 0

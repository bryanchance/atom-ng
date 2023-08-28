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

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2017" &&
export GYP_MSVS_VERSION="2017" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

# --help
displayHelp () {
	printf "\n" &&
	printf "${bold}${GRE}Script to build Atom-ng on Linux.${c0}\n" &&
	printf "${bold}${YEL}Use the --deps flag to install build dependencies.${c0}\n" &&
	printf "${bold}${YEL}Use the --bootstrap flag to install npm packages.${c0}\n" &&
	printf "${bold}${YEL}Use the --build flag to build Atom-ng.${c0}\n" &&
	printf "${bold}${YEL}Use the --clean flag to run \`npm run clean\`.${c0}\n" &&
	printf "${bold}${YEL}Use the --dist flag to generate .tar.xz and .deb packages.${c0}\n" &&
	printf "${bold}${YEL}Use the --help flag to show this help.${c0}\n" &&
	printf "\n"
}
case $1 in
	--help) displayHelp; exit 0;;
esac

# Install prerequisites
installDeps () {
	sudo apt-get install build-essential fakeroot git libsecret-1-dev libx11-dev libxkbfile-dev python2.7 python2.7-dev rpm
}
case $1 in
	--deps) installDeps; exit 0;;
esac

cleanAtom () {
	printf "\n" &&
	printf "${bold}${YEL} Cleaning artifacts and build directory...${c0}\n" &&
	
	npm run clean
}
case $1 in
	--clean) cleanAtom; exit 0;;
esac

bootstrapAtom () {
# Optimization parameters
export CFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

# Use upstream electron
# export ATOM_ELECTRON_URL='https://artifacts.electronjs.org/headers/dist' &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2017" &&
export GYP_MSVS_VERSION="2017" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

printf "\n" &&
printf "${bold}${GRE} Bootstrapping with \`script/bootstrap\`...${c0}\n" &&
printf "\n" &&

# Workaround for jasmine
mkdir -v -p $HOME/.atom/.node-gyp &&
cp -v gitconfig $HOME/.atom/.node-gyp/.gitconfig &&

./script/bootstrap
}
case $1 in
	--bootstrap) bootstrapAtom; exit 0;;
esac

buildAtom () {
# Optimization parameters
export CFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

# Use upstream electron
# export ATOM_ELECTRON_URL='https://artifacts.electronjs.org/headers/dist' &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2017" &&
export GYP_MSVS_VERSION="2017" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

printf "\n" &&
printf "${bold}${GRE} Building Atom-ng for Linux...${c0}\n" &&
printf "\n" &&

# Workaround for jasmine
mkdir -v -p $HOME/.atom/.node-gyp &&
cp -v gitconfig $HOME/.atom/.node-gyp/.gitconfig &&

# Run final bootstrap
./script/bootstrap &&

export NODE_ENV=production &&

# Build for linux
./script/build
}
case $1 in
	--build) buildAtom; exit 0;;
esac

packageAtom () {
# Optimization parameters
export CFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CXXFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export CPPFLAGS="-DNDEBUG -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-implicit-fallthrough -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

# Use upstream electron
# export ATOM_ELECTRON_URL='https://artifacts.electronjs.org/headers/dist' &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2017" &&
export GYP_MSVS_VERSION="2017" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron/bin" &&
export electron_config_cache="${PWD}/electron/bin" &&

printf "\n" &&
printf "${bold}${GRE} Generating installation packages...${c0}\n" &&
printf "\n" &&

# Workaround for jasmine
mkdir -v -p $HOME/.atom/.node-gyp &&
cp -v gitconfig $HOME/.atom/.node-gyp/.gitconfig &&

# Run final bootstrap
./script/bootstrap &&

export NODE_ENV=production &&

# Build linux package and archive for distribution
./script/build --create-debian-package --compress-artifacts
}
case $1 in
	--dist) packageAtom; exit 0;;
esac

printf "\n" &&
printf "${bold}${GRE}Script to build Atom-ng on Linux.${c0}\n" &&
printf "${bold}${YEL}Use the --deps flag to install build dependencies.${c0}\n" &&
printf "${bold}${YEL}Use the --bootstrap flag to install npm packages.${c0}\n" &&
printf "${bold}${YEL}Use the --build flag to build Atom-ng.${c0}\n" &&
printf "${bold}${YEL}Use the --clean flag to run \`npm run clean\`.${c0}\n" &&
printf "${bold}${YEL}Use the --dist flag to generate .tar.xz and .deb packages.${c0}\n" &&
printf "${bold}${YEL}Use the --help flag to show this help.${c0}\n" &&
printf "\n" &&

tput sgr0 &&
exit 0

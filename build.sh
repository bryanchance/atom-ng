#!/bin/bash

./script/bootstrap &&

./script/build --create-debian-package --compress-artifacts

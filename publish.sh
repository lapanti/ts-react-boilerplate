#!/usr/bin/env bash

git config --global user.email "laurilavanti@gmail.com"
git config --global user.name "Travis CI"
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key
yarn run docs:publish

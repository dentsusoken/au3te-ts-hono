#!/bin/bash

echo "Setting up npm links..."

WORKING_DIR=$(pwd)
BUILD_DIR=./build
OID4VC_CORE_DIR=/oid4vc-core
AU3TE_TS_COMMON_DIR=/au3te-ts-common
AU3TE_TS_BASE_DIR=/au3te-ts-base

cd $BUILD_DIR$OID4VC_CORE_DIR
npm i
npm run build
npm link

cd $WORKING_DIR
cd $BUILD_DIR$AU3TE_TS_COMMON_DIR
npm i
npm link oid4vc-core
npm run build
npm link

cd $WORKING_DIR
cd $BUILD_DIR$AU3TE_TS_BASE_DIR
npm i
npm link oid4vc-core au3te-ts-common
npm run build
npm link

cd $WORKING_DIR
npm i
npm link oid4vc-core au3te-ts-common au3te-ts-base

echo "Done"
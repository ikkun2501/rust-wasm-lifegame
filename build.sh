#!/bin/sh

wasm-pack build
(cd www;npm run start)
#!/bin/sh
ssh-keygen -t rsa -b 4096 -E SHA512 -m PEM -f jwt_rs512.key
openssl rsa -in jwt_rs512.key -pubout -outform PEM -out jwt_rs512.key.pub

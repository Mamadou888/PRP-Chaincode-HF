#!/bin/bash
docker rm -f $(docker ps -aq)

docker network prune -f

docker rmi dev-peer0.org1.example.com-fabcar-1.0-5c906e402ed29f20260ae42283216aa75549c571e2e380f3615826365d8269ba


#///////////////////////////////

CC_CONTAINERS=$(docker ps | grep dev-$PEER | awk '{print $1}')
if [ -n "$CC_CONTAINERS" ]; then
docker rm -f $CC_CONTAINERS
fi
CC_IMAGES=$(docker images | grep dev-$PEER | awk '{print $1}')
if [ -n "$CC_IMAGES" ]; then
docker rmi -f $CC_IMAGES
fi

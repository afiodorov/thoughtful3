#!/bin/bash
geth --port 3000 --nodiscover --datadir=./blockchain --maxpeers=0 --http --http.api personal,eth,net,web3,miner,debug --allow-insecure-unlock --http.corsdomain=*

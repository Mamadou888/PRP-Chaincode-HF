
## Product Registration System Blockchain

Works with Hyperledger Fabric (https://www.hyperledger.org/projects/fabric).
Uses currently the fabcar's tutorial network as a basis that was modified and built upon.

## Manual of the user

Open a bash terminal in the PRS folder and issue the command `npm install`
Then, please copy and paste grpc_node.node that is in the patch folder in PRP-ChaincodeHF/PRS/node_modules/fabric_client/node_modules/grpc/src/node/extension_binary/node-v57-linux-x64-glibc
From the PRS folder again, issue `./startFabric.sh`

Now that the network is launched, you can query the entirety of the ledger with the command: `node query.js`
Or you can insert a new product, a refrigerator, by using `node invoke.js`
If you want to experiment with your own inserts or queries, you can modify the request in both of these scripts, another request example is provided in query.js to query only one product.

The chaincode contains more functions to try which are not shown in query.js and invoke.js.



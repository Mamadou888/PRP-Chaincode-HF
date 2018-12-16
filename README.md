
## Product Registration System Blockchain

Works with Hyperledger Fabric (https://www.hyperledger.org/projects/fabric).
Uses currently the fabcar's tutorial network as a basis that was modified and built upon.

## Manual of the user

Open a bash terminal in the PRS folder and issue the command `npm install` and `./startFabric.sh`.

If you obtain an error about grpc_node.node or that you see in the error message the link below, please verify if grpc_node.node is present in PRP-ChaincodeHF/PRS/node_modules/fabric_client/node_modules/grpc/src/node/extension_binary/node-v57-linux-x64-glibc.
If not, either try to delete the node_modules folder in PRS and issue again `npm install` or manually put gprc_node.node that is in PRP-ChaincodeHF/patch.
From the PRS folder again, issue `./startFabric.sh`

Now that the network is launched, you can query the entirety of the ledger with the command: `node query.js`
Or you can insert a new product, a refrigerator, by using `node invoke.js`
If you want to experiment with your own inserts or queries, you can modify the request in both of these scripts, another request example is provided in query.js to query only one product.

The chaincode contains more functions to try which are not shown in query.js and invoke.js.



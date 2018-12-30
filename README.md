# Product Registration System Demo

This git repository provides a blockchain network based on Hyperledger Fabric (https://www.hyperledger.org/projects/fabric) fabcar's network.

## Manual of the user

Before starting, please verify that your system possess the prerequisites : https://hyperledger-fabric.readthedocs.io/en/release-1.3/prereqs.html .

For this demo, we don't need Go, we use Node.Js instead.

If your PATH environment variable is not already pointing to the binary files necessary for the function of hyperledger fabric, please open a terminal and execute `export PATH=<full path to bin location>:$PATH`, bin is included in this git repository at `PRP-Chaincode-HF/bin` .

### Start the Hyperledger Fabric Network

* Open a bash terminal in the PRS folder (PRP-Chaincode-HF/PRS) and issue the command `npm install` and `./startFabric.sh`.

* If you obtain an error about grpc_node.node or that you see in the error message the link below, please verify that grpc_node.node is present in PRP-API/APP/PRS/node_modules/fabric_client/node_modules/grpc/src/node/extension_binary/node-v57-linux-x64-glibc.
If not, either try to delete the node_modules folder in PRS and issue again `npm install` or manually put gprc_node.node that is in PRP-API/APP/patch.
From the PRS folder again, issue `./startFabric.sh`.

### Types of interactions

* Query all: Queries all products
* Add product: Adds a product. Fields "Reference" and "Type" are required. Issuing this request with the reference of an existing product will allow you to change its type and all its attribute, but its entire status will be reset to blank.
* Modify product: Modifies a product. Field "Reference" is required. Issuing this request will allow you to change all its attributes except its type and will keep unchanged its status.
* Change status: Changes the status of a product (its acceptance or not into a market). Field "Reference" is required.
* Search product: Queries a given product identified by its reference. Field "Reference" is required.
* Get history: Queries the history of changes for a given product identified by its reference. Field "Reference" is required.

### Interact with the Network via the CLI

* Query all products : `node query queryAllProducts`
Prints all products

* Query a product by reference : `node query queryProductByKey <reference>`
Prints the product with the specific reference

* Get history of changes for a product : `node query getHistoryForProduct <reference>`
Prints the history of changes of a product with the specified reference

* Create a product : `node invoke createProduct <reference> <type> <brand> <model> <volume/lumens> <annualConsumption/watts>`

### Interact with the Network via an Express Application

[This repository](https://github.com/AlexandreDejous/PRP-App-HF) provides a local web application to interact with the network without the CLI

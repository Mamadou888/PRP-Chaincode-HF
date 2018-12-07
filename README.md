[//]: # (SPDX-License-Identifier: CC-BY-4.0)

## Product Registration System Blockchain

Works with Hyperledger Fabric (https://www.hyperledger.org/projects/fabric).
Uses currently the fabcar's tutorial network as a basis that was built upon.

## Manual of the user

Open a bash terminal in the PRS folder and issue the command `./startFabric.sh`

Now that the network is launched, you can query the entirety of the ledger with the command: `node query.js`
Or you can insert a new product, a refrigerator, by using `node invoke.js`
If you want to experiment with your own inserts or queries, you can modify the request in both of these scripts, another request example is provided in query.js to query only one product.

The chaincode contains more functions to try which are not shown in query.js and invoke.js.






## License <a name="license"></a>

Hyperledger Project source code files are made available under the Apache
License, Version 2.0 (Apache-2.0), located in the [LICENSE](LICENSE) file.
Hyperledger Project documentation files are made available under the Creative
Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.

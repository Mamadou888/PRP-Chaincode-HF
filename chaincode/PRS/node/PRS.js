/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');


let Chaincode = class {

  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

////////////////////////////////////////////////////////////////////////////
//////////////////////////   INIT    ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

  async initLedger(stub, args,thisClass) {
    console.info('============= START : Initialize Ledger ===========');
    let lighting = [];
    lighting.push({
      brand: 'LightBulbsInc',
      model: 'X-300',
      lumens: '320',
      watts: '4.5'
    });
    lighting.push({
      brand: 'LightBulbsInc',
      model: 'X-345',
      lumens: '600',
      watts: '8'
    });
    lighting.push({
      brand: 'EnergyLossCo',
      model: 'Z-12-6',
      lumens: '600',
      watts: '20'
    });
    lighting.push({
      brand: 'LightBulbsInc',
      model: 'X-1500',
      lumens: '1600',
      watts: '15'
    });

    for (let i = 0; i < lighting.length; i++) {
      lighting[i].docType = 'lighting';
      await stub.putState('LIGHTING' + i, Buffer.from(JSON.stringify(lighting[i])));
      console.info('Added <--> ', lighting[i]);
    }

    let refrigerators = [];
    refrigerators.push({
      brand: 'IglooAtHome',
      model: 'Prime',
      volume: '0.1',
      annualConsumption: '150'
    });
    refrigerators.push({
      brand: 'EnergyLossCo',
      model: 'ZT-3450',
      volume: '0.4',
      annualConsumption: '2000'
    });
    refrigerators.push({
      brand: 'Simenes',
      model: 'FoodKeeper-C6',
      volume: '0.3',
      annualConsumption: '700'
    });
    refrigerators.push({
      brand: 'IglooAtHome',
      model: 'Secundus',
      volume: '0.15',
      annualConsumption: '175'
    });
    for (let i = 0; i < refrigerators.length; i++) {
      refrigerators[i].docType = 'refrigerator';
      await stub.putState('REFRIGERATOR' + i, Buffer.from(JSON.stringify(refrigerators[i])));
      console.info('Added <--> ', refrigerators[i]);
    }

    console.info('============= END : Initialize Ledger ===========');
  }

////////////////////////////////////////////////////////////////////////////
//////////////////////////   INVOKE   //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


  async createProduct(stub, args, thisClass) {
    console.info('============= START : Create Product ===========');
    /*if (args.length != 6) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }*/
    if (args[1]='refrigerator'){
      var product = {
      docType: 'refrigerator',
      brand: args[2],
      model: args[3],
      volume: args[4],
      annualConsumption: args[5]
      };
    }else if (args[1]='lighting'){
      var product = {
      docType: 'lighting',
      brand: args[2],
      model: args[3],
      lumens: args[4],
      watts: args[5]
      };

    }
    

    await stub.putState(args[0], Buffer.from(JSON.stringify(product)));
    //args[0] is the reference of the product, the unique ID for it
    console.info('============= END : Create Product ===========');
  }

////////////////////////////////////////////////////////////////////////////
//////////////////////////   QUERIES ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


  async queryProductByKey(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting Reference ex: REFRIGERATOR1');
    }
    let key = args[0];

    let productAsBytes = await stub.getState(key); //get the car from chaincode state
    if (!productAsBytes || productAsBytes.toString().length <= 0) {
      throw new Error(key + ' does not exist: ');
    }
    console.log(productAsBytes.toString());
    return productAsBytes;
  }

  async queryProductByDoctype(stub, args, thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting doctype.')
    }

    let doctype = args[0]//.toLowerCase();
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = doctype;
    let method = thisClass['getQueryResultForQueryString'];
    let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
    return queryResults; //shim.success(queryResults);
  }

  async queryLightingByBrand(stub, args, thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting brand name.')
    }

    let brand = args[0]//.toLowerCase();
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'lighting';
    queryString.selector.brand = brand;
    let method = thisClass['getQueryResultForQueryString'];
    let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
    return queryResults; //shim.success(queryResults);
  }

  async queryAllProducts(stub, args, thisClass) {


    let doctype = args[0]//.toLowerCase();
    let queryString = {};
    queryString.selector = {};
    let method = thisClass['getQueryResultForQueryString'];
    let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
    return queryResults; //shim.success(queryResults);
  }

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

  async getQueryResultForQueryString(stub, queryString, thisClass) {

    console.info('- getQueryResultForQueryString queryString:\n' + queryString)
    let resultsIterator = await stub.getQueryResult(queryString);
    let method = thisClass['getAllResults'];

    let results = await method(resultsIterator, false);

    return Buffer.from(JSON.stringify(results));
  }

  async getAllResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }

};

shim.start(new Chaincode());

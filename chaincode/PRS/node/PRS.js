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
      watts: '4.5',
      accepted: [],
      pending:[],
      rejected: []
    });
    lighting.push({
      brand: 'LightBulbsInc',
      model: 'X-345',
      lumens: '600',
      watts: '8',
      accepted: [],
      pending:[],
      rejected: []
    });
    lighting.push({
      brand: 'EnergyLossCo',
      model: 'Z-12-6',
      lumens: '600',
      watts: '20',
      accepted: ['europe'],
      pending:['canada'],
      rejected: []
    });
    lighting.push({
      brand: 'LightBulbsInc',
      model: 'X-1500',
      lumens: '1600',
      watts: '15',
      accepted: [],
      pending:[],
      rejected: []
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
      annualConsumption: '150',
      accepted: [],
      pending:[],
      rejected: []
    });
    refrigerators.push({
      brand: 'EnergyLossCo',
      model: 'ZT-3450',
      volume: '0.4',
      annualConsumption: '2000',
      accepted: [],
      pending:[],
      rejected: []
    });
    refrigerators.push({
      brand: 'Simenes',
      model: 'FoodKeeper-C6',
      volume: '0.3',
      annualConsumption: '700',
      accepted: [],
      pending:[],
      rejected: []
    });
    refrigerators.push({
      brand: 'IglooAtHome',
      model: 'Secundus',
      volume: '0.15',
      annualConsumption: '175',
      accepted: [],
      pending:[],
      rejected: []
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
    if (args.length != 6) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }
    if (args[1]=='refrigerator'){
      var product = {
      docType: 'refrigerator',
      brand: args[2],
      model: args[3],
      volume: args[4],
      annualConsumption: args[5],
      accepted: [],
      pending:[],
      rejected: []
      };
    }
    if (args[1]=='lighting'){
      var product = {
      docType: 'lighting',
      brand: args[2],
      model: args[3],
      lumens: args[4],
      watts: args[5],
      accepted: [],
      pending:[],
      rejected: []
      };

    }
    

    await stub.putState(args[0], Buffer.from(JSON.stringify(product)));
    //args[0] is the reference of the product, the unique ID for it
    console.info('============= END : Create Product ===========');
  }

  async modifyProduct(stub, args, thisClass) {
    console.info('============= START : Create Product ===========');
    if (args.length != 5) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }
    let ProductAsBytes = await stub.getState(args[0]);
    let product = JSON.parse(ProductAsBytes);

    if (product.docType == 'refrigerator'){
	    product.brand = args[1];
	    product.model = args[2];
	    product.volume = args[3];
	    product.annualConsumption = args[4];
	}
    if (product.docType == 'lighting'){
	    product.brand = args[1];
	    product.model = args[2];
	    product.lumens = args[3];
	    product.watts = args[4];
	}
    
    await stub.putState(args[0], Buffer.from(JSON.stringify(product)));
    //args[0] is the reference of the product, the unique ID for it
    console.info('============= END : Create Product ===========');
  }



  async changeProductStatus(stub, args, thisClass) {
    console.info('============= START : changeProductStatus ===========');
    //args[0] = key or reference
    //args[1] = 'accepted', 'rejected', 'pending'
    //args[2 .. n] = market that is now accepting or rejecting or putting on hold the product

    /*if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }*/

    let ProductAsBytes = await stub.getState(args[0]);
    let product = JSON.parse(ProductAsBytes);


    for (var i = 2; i < args.length; i++){
      var alreadyChanged = false;
      for (var j = 0; j < product.accepted.length; j++){
        if (product.accepted[j]==args[i]){
          //if product already accepted for this market
          if(args[1]=='accepted'){
            //and our objective is to accept this product for this market
            console.info(product.accepted[j] + ' has already accepted ' + args[0]);
            alreadyChanged = true;
            //then do nothing and print message

          }else{
            product.accepted.splice(j,1);
            j--;
            //else delete the market id from the 'accepted' section of the product
          }

          
        }
      }
            for (var j = 0; j < product.pending.length; j++){
        if (product.pending[j]==args[i]){
          //if product already on hold for this market
          if(args[1]=='pending'){
            //and our objective is to put on hold this product for this market
            console.info(product.pending[j] + ' has already ' + args[0] + ' on hold');
            alreadyChanged = true;
            //then do nothing and print message

          }else{
            product.pending.splice(j,1);
            j--;
            //else delete the market id from the 'pending' section of the product
          }
        }
      }
      for (var j = 0; j < product.rejected.length; j++){
        if (product.rejected[j]==args[i]){
          //if product already rejected
          if(args[1]=='rejected'){
            //and our objective is to reject this product for this market
            console.info(product.rejected[j] + ' has already rejected ' + args[0]);
            alreadyChanged = true;
            //then do nothing and print message

          }else{
            product.rejected.splice(j,1);
            j--;
            //else delete the market id from the 'reject' section of the product
          }
        }
      }
      if (!alreadyChanged){
        //if we want to change the status of the product regarding a certain market
        //and the change we want to do hasn't already been done, then do it
        if(args[1]=='accepted'){

          product.accepted.push(args[i]);

        }else if(args[1]=='rejected'){

          product.rejected.push(args[i]);

        }else if(args[1]=='pending'){

          product.pending.push(args[i]);

        }
      }
    }

    await stub.putState(args[0], Buffer.from(JSON.stringify(product)));
    console.info('============= END : changeCarOwner ===========');
  }

////////////////////////////////////////////////////////////////////////////
//////////////////////////   QUERIES   /////////////////////////////////////
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

  async getHistoryForProduct(stub, args, thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }
    let key = args[0];
    console.info('- start getHistoryForProduct: %s\n', key);

    let resultsIterator = await stub.getHistoryForKey(key);
    let method = thisClass['getAllResults'];
    let results = await method(resultsIterator, true);

    return Buffer.from(JSON.stringify(results));
  }

};

shim.start(new Chaincode());
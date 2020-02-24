// Import the page's CSS. Webpack will know what to do with it,
// as it's been configured by truffle-webpack
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// Make sure you've ran truffle compile first
import contract_build_artifacts from '../../build/contracts/OraclizeTest.json'

// OraclizeContract is our usable abstraction, which we'll use through the code below.
var OraclizeContract = contract(contract_build_artifacts);

var accounts;
var account;

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      ready();
    // transfer();
    }
  }

window.App = {
  
  // 'Constructor'
  start: function() {
    var self = this;

    // Bootstrap the Contract abstraction for use with the current web3 instance
    OraclizeContract.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(async function(err, accs) {

      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      web3.eth.defaultAccount = accounts[0];
      account = accounts[0];

      self.callEvents();
    });
  },

  // Show an error
  // setStatus: function(message) {
  //   var status = document.getElementById("status");
  //   status.innerHTML = message;
  // },
  
  callingEvents: function(instance){
    var LogInfo = instance.LogInfo({},{fromBlock: 0, toBlock: 'latest'});
    var LogFunctioning = instance.LogFunctioning({},{fromBlock: 0, toBlock: 'latest'});
    var LogDeposit = instance.LogDeposit({},{fromBlock: 0, toBlock: 'latest'});
    var LogTransfer = instance.LogTransfer({},{fromBlock: 0, toBlock: 'latest'});

    LogFunctioning.watch(function(err, result){
      if(!err){
        console.info(result.args)
      }else{
        console.error(err)
      }
    })

    LogInfo.watch(function(err, result){
      if(!err){
        console.info(result.args)
      }else{
        console.error(err)
      }
    })

    LogDeposit.watch(function(err, result){
      if(!err){
        console.info(result.args.sender)
         console.info(result.args.amount)
      }else{
        console.error(err)
      }
    })

    LogTransfer.watch(function(err, result){
      if(!err){
         console.info(result.args.sender)
         console.info(result.args.to)
         console.info(result.args.amount)
      }else{
        console.error(err)
      }
    })
  },

    callEvents: function() {
    var self = this;
    var meta;
          OraclizeContract.deployed().then(function(instance) {
            meta = instance;

              App.callingEvents(instance);
    })
  }        
          
};
// Front-end entry point

  window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    ethereum.enable();
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  // All systems go, start App!
  App.start();
});

function ready(){
    var fromAddress1 = document.querySelector("#bet #fromAddress1").value;
    var privateKey1 = document.querySelector("#bet #privateKey1").value;
    var fromAddress2 = document.querySelector("#bet #fromAddress2").value;
    var privateKey2 = document.querySelector("#bet #privateKey2").value;
    console.log(fromAddress1)
    var betAmount = document.querySelector("#bet #betAmount").value;
    var takeoutAmount = +betAmount * 2;
    console.log(takeoutAmount)
    
    var contract = web3.eth.contract(OraclizeContract.abi).at(OraclizeContract.address);
  
    console.log(contract)

    //var sendata = contract.new.getData(web3.toWei(betAmount, "ether"));

    var team = document.querySelector("#bet #team").value;
    console.log(team)

document.getElementById("bet").addEventListener("submit", function(e){
    e.preventDefault();

   

    //console.log(contract.homeBet())

    if(team == "Home")
    {
      team = 1;
    }
    else
    {
      team = 2;
    }
      
OraclizeContract.deployed().then(function(instance) {

  console.log("Initializing");
  instance.deposit({from: fromAddress1, 
                    gas: 3000000,
                    value: web3.toWei(betAmount, 'ether')}) //betAmount is a input box and fetching its value into betamount variable and passing it over here
                               .then(function(v){
                                       console.log(v);
                                       console.log("Function Executed");

                                 });
                       }).then(function() {
                                              console.log("Testing");
                       }).catch(function(e) {
                                               console.log(e);
                       });

  //----------------------------------------------------
  //---------------------------------------------------                     

})
document.getElementById("transfer").addEventListener("submit", function(e){
      e.preventDefault();
       console.log("Initializing");
         contract.transfer(fromAddress2,web3.toWei(takeoutAmount),
              {gas: 3000000,
               from: fromAddress1},
                   function (error, result){ 
                          if(!error){
                            console.log(result);//transaction successful
                                } else{
                           console.log(error);//transaction failed
                             }
         })});
}
//---------create second button----------------
     // OraclizeContract.deployed().then(function(instance) {

     //                      console.log("Initializing");
     //                      instance.deposit({from: fromAddress2, gas: 3000000, value: web3.toWei(betAmount, 'ether')})
     //                           .then(function(v){
     //                                   console.log(v);
     //                                   console.log("Function Executed");
     //                                 //  return queryRecheck(instance);
     //                             });
     //                   }).then(function() {
     //                                          console.log("Testing");
     //                   }).catch(function(e) {
     //                                           console.log(e);
     //                   });





    // contract.betOnTeam.sendTransaction(team, {from: fromAddress1,  value: web3.toWei(betAmount, 'ether'), gas: 3000000}
    //   ,function (error, result){ 
    //        if(!error){
    //            console.log(result);//transaction successful
    //        } else{
    //            console.log(error);//transaction failed
    //        }
    //      });
    // OraclizeContract.deployed().then(function(instance){
    //     instance.betOnTeam(team, {from: fromAddress1, gas: 444444});
    //   })


   //  var gettdata = contract.bettingTeam.getData(team);
    // console.log(gettdata)
     //----------------------------------------------------
    //  var gasRequired = contract.bettingTeam.estimateGas(team, {

    //   from: fromAddress1,
    //   value: betAmount,
    //   to: contract.address
    //  }, function(err, transactionHash) {
    //    if (!err)
    // console.log(transactionHash); 
    // })

    //  const Tx = require('ethereumjs-tx').Transaction
    //   privateKey1 = new Buffer(privateKey1, "hex");

    //  web3.eth.getTransactionCount(fromAddress1, function(error,nonce){

    //   var rawTx = {
    //     gas: "0xf4240",
    //     gasPrice: "0x04a817c800",
    //     gasLimit: "0xf4240",
    //     from: fromAddress1,
    //     nonce: web3.toHex(nonce),
    //     data: gettdata,
    //     to: contract.address,
    //     value: web3.toHex(betAmount)
    //   }

    //   var tx = new Tx(rawTx);
    //   tx.sign(privateKey1);

    //   var serializeTx = tx.serialize();

    //   web3.eth.sendRawTransaction("0x" + serializeTx.toString("hex"),
    //     function(err, hash) {
    //       if(!err)
    //       {
    //         document.querySelector("#bet #message").innerHTML = "transaction hash: " + hash;
    //       }
    //       else
    //       {
    //         document.querySelector("#bet #message").innerHTML = err;
    //       }
    //     })
    //  })

    
   // console.log(team)
    //---------------------------------------------------------
  //  var amount = contract.amount();
  // OraclizeContract.deployed().then(function(instance) {

  //                         console.log("Initializing");
  //                         instance.update({from: fromAddress1, gas: 3000000, value: web3.toWei(betAmount, 'ether')})
  //                              .then(function(v){
  //                                      console.log(v);
  //                                      console.log("Function Executed");
  //                                    //  return queryRecheck(instance);
  //                                });
  //                      }).then(function() {
  //                                             console.log("Testing");
  //                      }).catch(function(e) {
  //                                              console.log(e);
  //                      });

    
    //console.log(data)
    //-----------------------------------------------------
   //    web3.eth.sendTransaction({
   //      to: fromAddress2,
   //      from: fromAddress1,
   //      value: web3.toWei(betAmount, "ether"),
   //     // data: gettdata,
   //      gas: 200000
   //    },function (error, result){ 
   //         if(!error){
   //             console.log(result);//transaction successful
   //         } else{
   //             console.log(error);//transaction failed
   //         }
   // });
//---------------------------------------------------

    



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
      fetch();
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
        console.info(result.args.executed)
      }else{
        console.error(err)
      }
    })

    LogTransfer.watch(function(err, result){
      if(!err){
         console.info(result.args.winner)
         console.info(result.args.win)
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
document.getElementById("bet").addEventListener("submit", function(e){
    e.preventDefault();

    window.fromAddress1 = document.querySelector("#bet #fromAddress1").value;

    console.log(fromAddress1)
    window.betAmount = document.querySelector("#bet #betAmount").value;
    window.takeoutAmount = +betAmount * 2;
   
    var contract = web3.eth.contract(OraclizeContract.abi).at(OraclizeContract.address);
  
    console.log(contract)

    

    var team = document.querySelector("#bet #team").value;

    console.log(team)

    //console.log(contract.homeBet())

    if(team == "Home")
    {
      team = 1;
    }
    else
    {
      team = 2;
    }
    console.log(team)
//----------------------------------------
    contract.deposit.sendTransaction(team, {from:fromAddress1, value: web3.toWei(betAmount, 'ether'), gas: 3000000}
      ,function (error, result){ 
           if(!error){
               console.log(result);//transaction successful
           } else{
               console.log(error);//transaction failed
           }
         });

  document.getElementById("player2").addEventListener("submit", function(e){
  e.preventDefault();

  var fromAddress2 = document.querySelector("#player2 #fromAddress2").value;
  var team2 = document.querySelector("#player2 #team2").value;
   if(team2 == "Home")
    {
      team2 = 1;
    }
    else
    {
      team2 = 2;
    }
  console.log(team2)
  console.log(fromAddress2);
  var contract = web3.eth.contract(OraclizeContract.abi).at(OraclizeContract.address);
  
   contract.deposit.sendTransaction(team2, {from:fromAddress2, value: web3.toWei(betAmount, 'ether'), gas: 3000000}
      ,function (error, result){ 
           if(!error){
               console.log(result);//transaction successful
           } else{
               console.log(error);//transaction failed
           }
         });
})
//--------------------------------------

})
}





# Football_Betting-Smart-Contract


**This is the first Football Betting smart contract that uses Provable/Oraclize to fetch result from API and is developed with front end**

This is a Smart Contract that fetches result from API using Provable. The smart contract will fetch the result of a football match and will transfer ether into the winner's account. The contract will send a query to API and will fetch the result. The result, in this case, would be either HOME TEAM or AWAY TEAM. The transfer of ether will take place after checking who placed the bet on the winning team.

Tools used - Truffle , Truffle webpack, Metamask, Provable (oraclize),  ethereum-bridge.
API - https://fastestlivescores.com/live-scores-api-feed/

This project is developed in a local environment and is a nice example of how to use oraclize/provable to fetch the result and transfer ether between truffle accounts by using metamask/front end. The front end will enable the users to place bets on either HOME or AWAY team in a convenient manner.

Follow the steps on how to run this project or simply watch the video on Youtube.

**MAKE SURE YOU INSTALL ETHEREUM-BRIDGE AND CONFIGURE TRUFFLE WITH METAMASK**
Ethereum-bridge repository link - https://github.com/provable-things/ethereum-bridge
Add truffle accounts to your metamask - https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask

**STEPS**
1) Clone this repository into a new directory 
2) Run $ npm install inside the directory you just created to install its dependencies
3) Now Create a new folder (next to oraclize-test) called ethereum-bridge
4) Clone the ethereum-bridge repository, and install it’s dependencies too by running $ npm install inside the directory ethereum-bridge 
5) Install Metamask and import truffle accounts 
6) Start a new terminal window and type $ truffle develop
7) $ truffle develop (run this command inside project directory in (in my case it is oraclize-test) a new terminal window and do not close it)
8) $ node bridge -a 9 -H 127.0.0.1 -p 9545 --dev (run this command inside the ethereum-bridge directory in a new terminal window and do not close it)
                The -a 9 argument instructs ethereum-bridge to use the last account created by our local Truffle Testnet node to deploy                 the Oraclize contract. 
9) $ truffle migrate --development --reset (run both 6 and 7 commands in a new terminal window inside project directory)
10) Run $ npm run dev to start Truffle server
11) Go to http://localhost:8080 to see the DApp.

Youtube link - https://youtu.be/d57E4HM55Ek

You must have basic knowledge of using these tools and solidity language in order to run this project otherwise you might get stuck
You only need to run npm install command once as it only installs project dependencies

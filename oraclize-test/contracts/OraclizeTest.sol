pragma solidity ^0.4.22;

import "installed_contracts/strings.sol";
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";

contract OraclizeTest is usingOraclize {

    using strings for *;        //strings import requirement

    uint public amount; 

    address public homeBet;  
    address public awayBet;

    address public winner;
 

    // Constructor
    function OraclizeTest () public {    
        
        // Replace the next line with your version:
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);

        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
       
    }
    //-----------------------------------
    mapping (address => uint256) public amountStore;

    event LogDeposit(address sender, uint amount, string executed);
    event LogTransfer(address winner, string win);

    function deposit(uint team) public payable returns(bool success) {
        if(team == 1)
        {
        homeBet = msg.sender;
        amountStore[msg.sender] += msg.value;
        emit LogDeposit(msg.sender, msg.value, "Executed deposit HOME");
        oraclize_query("URL", "json(https://api.crowdscores.com/v1/matches/123945?api_key=c0b5db1146324e89bf180d1bd35adba3).outcome.winner");
        return true;
        }
        else if(team == 2)
        {
        awayBet = msg.sender;
        amountStore[msg.sender] += msg.value;
        emit LogDeposit(msg.sender, msg.value, "Executed deposit AWAY");
        oraclize_query("URL", "json(https://api.crowdscores.com/v1/matches/123945?api_key=c0b5db1146324e89bf180d1bd35adba3).outcome.winner");
        return true; 
        }
    }

   
    //--------------------------------------------------------------------------------------
    function __callback(bytes32 id, string result, bytes proof) public {



    emit LogInfo("REACHED CALLBACK");

    require(msg.sender == oraclize_cbAddress());        // just to be sure the calling address is the Oraclize authorized one

    makePayment(result);
    
    }

    function makePayment(string result) public {

    emit LogInfo("REACHED makePayment-----------------");

        if (result.toSlice().equals("home".toSlice()))
    {
        emit LogInfo("Trying transfer home----------------");
        homeBet.transfer(this.balance);
        winner = homeBet;
        emit LogInfo("REACHED transfer end-----------------");
    }
    else if(result.toSlice().equals("away".toSlice()))
    {

        emit LogInfo("REACHED AWAY-----------------");
        awayBet.transfer(this.balance);
        winner = awayBet;
        emit LogTransfer(winner,"winner winner");
    }
    else if(result.toSlice().equals("draw".toSlice()))
    {
        homeBet.transfer(address(this).balance / 2);
        awayBet.transfer(address(this).balance / 2);
    }

    }
    

    event LogFunctioning(string functioning);
    event LogInfo(string description);      //getting from update function

    

    // Fallback function
    function()
    public{
        revert();
    }
    

}

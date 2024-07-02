// SPDX-License-Identifier: MIT
/* 
                                        
                   .                    
                  .                     
                .  ..                   
               . .+*...                 
             .. :+#%*-..                
            .  -*#%@@%=.. ..            
           . .+##@@#%@@*:.. .           
          . :*%%@%===#@@#-..            
        .. :*%%@#-=%#=*%@%+:..          
       .  :*%@%+-+%%#*+*%@@*:..         
        .-*%@%=-#@@@%#***#%@#-....      
     ...+#%@#-=%@%@@%%+****#@%+:..      
     . =@@@*-*@@@%%@%++%*+++#@@*.       
     . #@@#=#@@@@@%#+*%##*+=+%@@+.      
    . .%@@+*@@@@@@@%#%###**++#@@#. .    
    . .%@%+#@@@@@@@@%%###*+++#@@#. .    
    . .%@%+#%*%@@@@@%%%%*-:+*#@@#. .    
    . .%@%=*@#+%@@@@%%%*-:-+*+@@#. .    
    . .%@#-+@@#=#@@@%%#-:=+*+=%@%. .    
      .*%*-+@@@#=*%@@#-:+**#=-%@%. .    
      .+@#-+@%%@#=+%#-:*##**=-%@%. .    
      .=@%=+@#+%@%==--*#%*+#==%@#. .    
      .+@@=*@@#+%%%+=#%%**@%==@@#. .    
       #@@*##%@#*@%%%%%*#@@***@@%. .    
     . #@@%%%*%@@@@%%@@%@%+##%@@#..     
     . -@@@%@@#%@@@@@@@@#+##%@@@= .     
      ..+@@@@@@#%@@@@@@**%%@@@@+..      
       . -%@@@@%##@@@%*#%@@@@%- .       
        . .*@@@@*+%@%*#@@@@@*. .        
         .  -%@@@++%*+#@@@%=  .         
          .. :#@@@#++#@@@#: ..          
            . .+@@@@@@@@+. .            
             .. :#@@@@#: ..             
              .. .+@@+. .               
                .  ==  .                
                 ..  ..                 
                   ..                   
                                        
    Website: https://EVM.bet
    Twitter: https://x.com/EvmGames                                        

 */

pragma solidity 0.8.19;

/// @notice Interface of the VRF Gateway contract. Must be imported.
interface ISecretVRF {
    function requestRandomness(uint32 _numWords, uint32 _callbackGasLimit)
        external
        payable
        returns (uint256 requestId);
}

interface ILottery {
    /**
     * @notice View current lottery id
     */
    function viewCurrentLotteryId() external returns (uint256);
}

interface IRandomizer {
    /**
     * Requests randomness
     */
    function getRandomNumber(uint32 _callbackGasLimit, uint256 amountOfGas)
        external;

    /**
     * Views random result
     */
    function viewRandomResult() external view returns (uint32);

    /**
     * View latest lotteryId numbers
     */
    function viewLatestLotteryId() external view returns (uint256);
}

contract RandomnessReceiver is IRandomizer {
    /// @notice VRFGateway stores address to the Gateway contract to call for VRF
    address public VRFGateway;

    address public immutable owner;

    uint256 public latestLotteryId;
    uint256 public latestRandomNumber;
    uint256 public latestRequestId;
    uint32 public randomResult;
    address public lottery;

    /// @notice Event that is emitted when a VRF call was made (optional)
    /// @param requestId requestId of the VRF request. Contract can track a VRF call that way
    event requestedRandomness(uint256 requestId);

    event fulfilledRandomWords(uint256 requestId, uint256[] randomWords);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    /// @notice Sets the address to the Gateway contract
    /// @param _VRFGateway address of the gateway
    function setGatewayAddress(address _VRFGateway) external onlyOwner {
        VRFGateway = _VRFGateway;
    }

    /**
     * @notice Set the address for the lottery smart contract
     * @param _lottery: address of the lottery
     */
    function setLotteryAddress(address _lottery) external onlyOwner {
        lottery = _lottery;
    }

    /**
     * @notice View latestLotteryId
     */
    function viewLatestLotteryId() external view override returns (uint256) {
        return latestLotteryId;
    }

    /// @notice function on how to implement a VRF call using Secret VRF
    function getRandomNumber(uint32 _callbackGasLimit, uint256 amountOfGas)
        external
    {
        // Get the VRFGateway contract interface
        ISecretVRF vrfContract = ISecretVRF(VRFGateway);

        require(msg.sender == lottery, "caller not lottery");

        require(address(this).balance >= amountOfGas, "InsufficientFee");

        // Can be up to 2000 random numbers, change this according to your needs
        uint32 numWords = 1;

        // Call the VRF contract to request random numbers.
        // Returns requestId of the VRF request. A  contract can track a VRF call that way.
        latestRequestId = vrfContract.requestRandomness{value: amountOfGas}(
            numWords,
            _callbackGasLimit
        );

        // Emit the event
        emit requestedRandomness(latestRequestId);
    }

    /**
     * @notice View random result
     */
    function viewRandomResult() external view override returns (uint32) {
        return randomResult;
    }

    /*//////////////////////////////////////////////////////////////
                   fulfillRandomWords Callback
    //////////////////////////////////////////////////////////////*/

    /// @notice Callback by the Secret VRF with the requested random numbers
    /// @param requestId requestId of the VRF request that was initally called
    /// @param randomWords Generated Random Numbers in uint256 array
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) external {
        // Checks if the callback was called by the VRFGateway and not by any other address
        require(
            msg.sender == address(VRFGateway),
            "only Secret Gateway can fulfill"
        );

        // Do your custom stuff here, for example:
        require(latestRequestId == requestId, "Wrong requestId");

        randomResult = uint32(1000000 + (randomWords[0] % 1000000));

        latestLotteryId = ILottery(lottery).viewCurrentLotteryId();

        latestRandomNumber = randomWords[0];
        emit fulfilledRandomWords(requestId, randomWords);
    }

    receive() external payable {}

    function withdrawStuckXTZ() external onlyOwner {
        (bool success, ) = address(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Failed to withdraw stuck XTZ");
    }
}
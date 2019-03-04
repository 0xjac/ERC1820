pragma solidity ^0.5.3;

import "./ERC820aClient.sol";


contract ExampleClient is ERC820aClient {

    address private owner;

    constructor() public {
        setInterfaceImplementation("ExampleClient", address(this));
        owner = msg.sender;
    }

    function delegateManager() public {
        require(owner == msg.sender, "Not the owner");
        delegateManagement(msg.sender);
    }

}

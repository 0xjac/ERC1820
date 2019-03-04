pragma solidity ^0.5.3;

import "./ERC1820ImplementerInterface.sol";


contract ExampleImplementer is ERC1820ImplementerInterface {
    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) external view returns(bytes32) {
        return ERC1820_ACCEPT_MAGIC;
    }
}

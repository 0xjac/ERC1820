pragma solidity ^0.5.3;

import "./ERC820aImplementerInterface.sol";


contract ExampleImplementer is ERC820aImplementerInterface {
    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) external view returns(bytes32) {
        return ERC820A_ACCEPT_MAGIC;
    }
}

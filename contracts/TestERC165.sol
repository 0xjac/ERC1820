pragma solidity ^0.5.3;


contract LegacyNoCB {} // solium-disable-line no-empty-blocks


contract LegacyCBNoReturn {
    function () external {
    }
}


contract LegacyCBReturnTrue {
    function () external {
        assembly {
            mstore(0,1)
            return(0,32)
        }
    }
}


contract LegacyCBReturnFalse {
    function () external {
        assembly {
            mstore(0,1)
            return(0,32)
        }
    }
}

interface ERC165 {
    /// @notice Query if a contract implements an interface
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    ///  `interfaceID` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}


contract ERC165MappingImplementation is ERC165 {
    /// @dev You must not set element 0xffffffff to true
    mapping(bytes4 => bool) internal supportedInterfaces;

    constructor() internal {
        supportedInterfaces[this.supportsInterface.selector] = true;
    }

    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return supportedInterfaces[interfaceID];
    }
}

interface Simpson {
    function is2D() external returns (bool);
    function skinColor() external returns (string memory);
}


contract Lisa is ERC165MappingImplementation, Simpson {
    constructor() public {
        supportedInterfaces[this.is2D.selector ^ this.skinColor.selector] = true;
    }

    function is2D() external returns (bool) {} // solium-disable-line no-empty-blocks
    function skinColor() external returns (string memory) {} // solium-disable-line no-empty-blocks
}


contract Homer is ERC165, Simpson {
    function supportsInterface(bytes4 interfaceID) external view returns (bool) {
        return
            interfaceID == this.supportsInterface.selector || // ERC165
            interfaceID == this.is2D.selector ^ this.skinColor.selector; // Simpson
    }

    function is2D() external returns (bool) {} // solium-disable-line no-empty-blocks
    function skinColor() external returns (string memory) {} // solium-disable-line no-empty-blocks
}

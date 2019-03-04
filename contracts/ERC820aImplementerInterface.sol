pragma solidity ^0.5.3;


contract ERC820aImplementerInterface {
    bytes32 constant ERC820A_ACCEPT_MAGIC = keccak256(abi.encodePacked("ERC820A_ACCEPT_MAGIC"));

    /// @notice Indicates whether the contract implements the interface `interfaceHash` for the address `addr`.
    /// @param interfaceHash keccak256 hash of the name of the interface
    /// @param addr Address for which the contract will implement the interface
    /// @return ERC820A_ACCEPT_MAGIC only if the contract implements `ìnterfaceHash` for the address `addr`.
    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) external view returns(bytes32);
}

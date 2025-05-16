// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title ProofVault - Registro de hashes con timestamp en Base
*/
contract ProofVault {
    
    struct Proof {
        bytes32 fileHash;
        uint256 timestamp;
    }

    mapping(address => Proof[]) public proofs;
    mapping(bytes32 => address) public proofOoner;

    event ProofRegistered(address indexed user, bytes32 indexed hash, uint256 timestamp);

    function registerProof(bytes32 hash) external {
        require(hash != bytes32(0), "Invalid hash");
        require(proofOoner[ hash ] == address(0), "Already registered");

        proofs[msg.sender].push(Proof(hash, block.timestamp));
        proofOoner[hash] = msg.sender;

        emit ProofRegistered(msg.sender, hash, block.timestamp);
    }

    function getProofs(address user) external view returns (Proof[] memory) {
        return proofs[user];
    }

    function getOwnerOfHash(bytes32 hash) external view returns (address) {
        return proofOoner[hash];
    }
}
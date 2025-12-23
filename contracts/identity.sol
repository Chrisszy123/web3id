// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Identity {
    mapping(address => mapping(bytes32 => bool)) public roles;

    function grantRole(address user, bytes32 role) external {
        roles[user][role] = true;
    }

    function hasRole(address user, bytes32 role) external view returns (bool) {
        return roles[user][role];
    }
}

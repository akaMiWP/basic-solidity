// SPDX-License-Identifier: UNLICENSED

// Use 0.8.25+commit.b61c2a91 compiler on Remix VM
pragma solidity ^0.8.0;

contract Counter {
    string private name;
    uint private count;

    constructor(string memory _name, uint _count) {
        name = _name;
        count = _count;
    }

    function increment() public returns (uint newCount) {
        count++;
        return count;
    }

    function decrement() public returns (uint newCount) {
        count--;
        return count;
    }

    function getCount() public view returns (uint newCount) {
        return count;
    }

    function getName() public view returns (string memory newName) {
        return name;
    }

    function setName(
        string memory _name
    ) public returns (string memory newName) {
        name = _name;
        return name;
    }
}

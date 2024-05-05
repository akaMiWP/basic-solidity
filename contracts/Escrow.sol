// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    address payable buyer;
    address payable seller;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        address payable _buyer,
        address payable _seller
    ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        buyer = _buyer;
        seller = _seller;
    }

    function finalizeSale() public {
        IERC721 nft = IERC721(nftAddress);
        nft.transferFrom(seller, buyer, nftID);
    }
}

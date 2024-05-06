// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable buyer;
    address payable seller;
    address public inspector;
    address public lender;
    bool public isInspectionPassed;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Must be a buyer that could call this function");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Must be an inspector that could call this function");
        _;
    }

    mapping(address => bool) public approvalDict;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _buyer,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        buyer = _buyer;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    function depositEarnest() public payable onlyBuyer {
        require(msg.value >= escrowAmount, "Deposit amount is lower than the escrow amount");
    }

    function updateInspectionPassed(bool _passed) public onlyInspector {
        isInspectionPassed = _passed;
    }

    function approveSale() public {
        approvalDict[msg.sender] = true;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function finalizeSale() public {
        require(isInspectionPassed, "Must pass inspection test");
        require(approvalDict[buyer], "A buyer must approve");
        require(approvalDict[seller], "A seller must approve");
        require(approvalDict[lender], "A lender must approve");

        IERC721 nft = IERC721(nftAddress);
        nft.transferFrom(seller, buyer, nftID);
    }
}

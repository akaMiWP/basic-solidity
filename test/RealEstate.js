const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Real Estate", () => {
  let realEstate;
  let deployer, seller;
  let nftID = 1;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;

    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();
  });

  describe("Deployment", async () => {
    it("expect an NFT send to the deployer/seller", async () => {
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
    });
  });
});

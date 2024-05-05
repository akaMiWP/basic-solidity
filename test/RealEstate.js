const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Real Estate", () => {
  let realEstate, escrow;
  let deployer, seller, buyer;
  let nftID = 1;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;
    buyer = accounts[1];

    const RealEstate = await ethers.getContractFactory("RealEstate");
    const Escrow = await ethers.getContractFactory("Escrow");

    realEstate = await RealEstate.deploy();
    escrow = await Escrow.deploy(
      await realEstate.getAddress(),
      nftID,
      buyer.address,
      seller.address
    );

    await realEstate.waitForDeployment();
    await escrow.waitForDeployment();

    console.log("Escrow Address:", escrow.target);
    console.log("Real Estate Contract Address:", realEstate.target);
  });

  describe("Deployment", async () => {
    it("expect an NFT send to the deployer/seller", async () => {
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
    });
  });

  describe("Selling a real estate", async () => {
    it("executes a successful transaction", async () => {
      await realEstate.connect(seller).approve(escrow.target, nftID);

      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
      let transaction = await escrow.connect(buyer).finalizeSale();

      expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);
    });
  });
});

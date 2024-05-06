const { expect } = require("chai");
const { ethers } = require("hardhat");

const convertEtherToWei = (ether) => {
  return ethers.parseEther(ether);
};

const convertWeiToEther = (wei) => {
  return ethers.formatUnits(wei, "ether");
};

describe("Real Estate", () => {
  let realEstate, escrow;
  let deployer, seller, buyer, inspector, lender;
  let nftID = 1;
  let purchasePrice = "1";
  let escrowAmount = "0.2";

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;
    buyer = accounts[1];
    inspector = accounts[2];
    lender = accounts[3];

    const RealEstate = await ethers.getContractFactory("RealEstate");
    const Escrow = await ethers.getContractFactory("Escrow");

    realEstate = await RealEstate.deploy();
    escrow = await Escrow.deploy(
      await realEstate.getAddress(),
      nftID,
      convertEtherToWei(purchasePrice),
      convertEtherToWei(escrowAmount),
      buyer.address,
      seller.address,
      inspector.address,
      lender.address
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
    it("call an inspection update", async () => {
      expect(await escrow.isInspectionPassed()).to.equal(false);
      await escrow.connect(inspector).updateInspectionPassed(true);
      expect(await escrow.isInspectionPassed()).to.equal(true);
    });

    it("executes a successful transaction", async () => {
      await realEstate.connect(seller).approve(escrow.target, nftID);

      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
      await escrow.connect(buyer).depositEarnest({
        value: convertEtherToWei(escrowAmount),
      });
      let balance = await escrow.getBalance();
      expect(convertWeiToEther(balance)).to.equal(escrowAmount);

      await escrow.connect(inspector).updateInspectionPassed(true);
      await escrow.connect(buyer).approveSale();
      await escrow.connect(seller).approveSale();
      await escrow.connect(lender).approveSale();

      let transaction = await escrow.connect(buyer).finalizeSale();
      expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);
    });
  });
});

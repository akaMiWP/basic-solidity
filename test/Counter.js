const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", () => {
  let counter;
  beforeEach(async () => {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy("Hello World", 123);
  });

  it("stores the count", async () => {
    const count = await counter.getCount();
    expect(count).to.equal(123);
  });

  it("stores the name", async () => {
    const name = await counter.getName();
    expect(name).to.equal("Hello World");
  });
});

describe("Test increment", () => {
  let counter;
  beforeEach(async () => {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy("Hello World", 0);
  });

  it("expect count to be incremneted", async () => {
    await counter.increment();
    let count = await counter.getCount();

    expect(count).to.equal("1");
  });

  it("expect count to be incremneted three times", async () => {
    await counter.increment();
    await counter.increment();
    await counter.increment();
    let count = await counter.getCount();

    expect(count).to.equal("3");
  });
});

describe("Test decrement", () => {
  let counter;

  beforeEach(async () => {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy("Hello World", 3);
  });

  it("expect count to be decremented", async () => {
    await counter.decrement();
    let count = await counter.getCount();
    expect(count).to.equal(2);
  });

  it("expect count to be decremented three times", async () => {
    await counter.decrement();
    await counter.decrement();
    await counter.decrement();
    let count = await counter.getCount();
    expect(count).to.equal(0);

    await expect(counter.decrement()).to.be.reverted;
  });
});

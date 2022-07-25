const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("SimpleToken", async () => {
  let contract = null;
  let accounts = null;
  let provider = ethers.provider;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("SimpleToken");
    contract = await ContractFactory.deploy();
    await contract.deployed()
  });

  describe("Token Name and Symbol",  async () => {
    it("should return the correct name",  async () => {
        expect(await contract.name()).to.be.equal("MYTOKEN");
    })

    it("should return the correct symbol", async () => {
        expect(await contract.symbol()).to.be.equal("MT");
    })
  })
});
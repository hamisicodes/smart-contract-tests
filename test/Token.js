const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Token", () => {
  let contract = null;
  let accounts = null;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("Token");
    contract = await ContractFactory.deploy();
    await contract.deployed();
  });

  describe("TokenIds", async () => {
    it("Should return accurate Token ids", async () => {
      expect(await contract.ZERO()).to.be.equal(new BigNumber.from("0"));
      expect(await contract.ONE()).to.be.equal(new BigNumber.from("1"));
      expect(await contract.TWO()).to.be.equal(new BigNumber.from("2"));
      expect(await contract.THREE()).to.be.equal(new BigNumber.from("3"));
      expect(await contract.FOUR()).to.be.equal(new BigNumber.from("4"));
      expect(await contract.FIVE()).to.be.equal(new BigNumber.from("5"));
      expect(await contract.SIX()).to.be.equal(new BigNumber.from("6"));
    });
  });
});

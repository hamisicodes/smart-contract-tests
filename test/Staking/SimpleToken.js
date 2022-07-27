const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("SimpleToken", async () => {
  let contract = null;
  let accounts = null;
  let provider = ethers.provider;
  const ATTACKER_ID = 2; 
  const DEPLOYER_ID = 0;


  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("SimpleToken");
    contract = await ContractFactory.connect(accounts[DEPLOYER_ID]).deploy();
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

  describe("mint", async () => {
    it("should be able to mint token for any address", async () => {
    
    for(let i = 0; i < accounts.length; i++){
      await expect(contract.mint(accounts[i].address, 100)).to.not.be.reverted;
    }

    })
  })

  describe("viewBalance", async () => {
    it("should return balance of the contract", async () => {
      expect(await contract.viewBalance()).to.be.equal(
        new BigNumber.from("0")
      );

    })

    it("should only allow the deployer/owner to view contract balance", async () => {
      await expect(contract.connect(accounts[ATTACKER_ID]).viewBalance()).to.be
        .reverted;

      await expect(contract.connect(accounts[DEPLOYER_ID]).viewBalance()).to.not.be.reverted;
    })
  })
});

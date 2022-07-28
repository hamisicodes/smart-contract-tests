const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("FreeNFT", async () => {
  let contract = null;
  let accounts = null;
  const ATTACKER_ID = 2;
  const DEPLOYER_ID = 0;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("FreeNFT");
    contract = await ContractFactory.deploy();
    await contract.wait();

  })
});

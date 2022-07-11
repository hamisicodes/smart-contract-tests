const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = ethers;

describe("Token", async () => {
  let contract = null;
  let accounts = null;
  let provider = await ethers.provider;

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

  describe("mintToken", async () => {
    it("Should only mint token 0, 1 or 2", async () => {
      const tx1 = await contract.mintToken(0, 10);
      await tx1.wait();

      expect(await contract.getBalance(0)).to.be.equal(
        new BigNumber.from("10")
      );

      provider.send("evm_increaseTime", [60 + 1]);
      const tx2 = await contract.mintToken(1, 15);
      await tx2.wait();

      expect(await contract.getBalance(0)).to.be.equal(
        new BigNumber.from("10")
      );
      expect(await contract.getBalance(1)).to.be.equal(
        new BigNumber.from("15")
      );

      provider.send("evm_increaseTime", [60 + 1]);
      const tx3 = await contract.mintToken(2, 25);
      await tx3.wait();

      expect(await contract.getBalance(0)).to.be.equal(
        new BigNumber.from("10")
      );
      expect(await contract.getBalance(1)).to.be.equal(
        new BigNumber.from("15")
      );
      expect(await contract.getBalance(2)).to.be.equal(
        new BigNumber.from("25")
      );
    });
  });

  describe("mintReverted", async () => {
    context("Cool down", async () => {
      it("Should prevent mint during cool down period", async () => {
        const tx1 = await contract.mintToken(0, 10);
        await tx1.wait();

        await expect(contract.mintToken(1, 15)).to.be.revertedWith(
          "1-minute cooldown between mints"
        );

        provider.send("evm_increaseTime", [60 + 1]);
        await expect(contract.mintToken(1, 15)).to.not.be.reverted;
      });
    });

    context("Invalid Token", async () => {
      it("Should revert if token id is neither 0,1 or 2", async () => {
        await expect(contract.mintToken(3, 10)).to.be.revertedWith(
          "cannot mint token"
        );

        await expect(contract.mintToken(4, 10)).to.be.revertedWith(
          "cannot mint token"
        );

        await expect(contract.mintToken(5, 10)).to.be.revertedWith(
          "cannot mint token"
        );

        await expect(contract.mintToken(6, 10)).to.be.revertedWith(
          "cannot mint token"
        );
      });
    });
  });
});

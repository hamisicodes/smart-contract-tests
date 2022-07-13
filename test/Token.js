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

  describe("ForgeToken", async () => {
    beforeEach(async () => {
      const tx1 = await contract.mintToken(0, 20);
      await tx1.wait();

      provider.send("evm_increaseTime", [60 + 1]);

      const tx2 = await contract.mintToken(1, 20);
      await tx2.wait();

      provider.send("evm_increaseTime", [60 + 1]);

      const tx3 = await contract.mintToken(2, 20);
      await tx3.wait();
    });

    context("mintThree", async () => {
      it("should forge three when the combination is correct", async () => {
        expect(await contract.getBalance(3)).to.be.equal(
          new BigNumber.from("0")
        );

        let tx = await contract.mintThree([0, 1], [5, 5]);
        await tx.wait();

        expect(await contract.getBalance(3)).to.be.equal(
          new BigNumber.from("5")
        );
      });

      it("should revert forge when more than 2 combinations are given", async () => {
        await expect(
          contract.mintThree([0, 1, 2], [10, 10, 10])
        ).to.be.revertedWith("Only 2 tokens can be burned");
      });

      it("should revert forge when there is an invalid tokens", async () => {
        await expect(contract.mintThree([0, 2], [10, 10])).to.be.revertedWith(
          "invalid tokens"
        );
      });

      it("should revert forge when same amounts are not provided", async () => {
        await expect(contract.mintThree([0, 1], [10, 5])).to.be.revertedWith(
          "same amounts required"
        );
      });
    });

    context("mintFour", async () => {
      it("should forge four when the combination is correct", async () => {
        expect(await contract.getBalance(4)).to.be.equal(
          new BigNumber.from("0")
        );

        let tx = await contract.mintFour([1, 2], [5, 5]);
        await tx.wait();

        expect(await contract.getBalance(4)).to.be.equal(
          new BigNumber.from("5")
        );
      });

      it("should revert forge when more than 2 combinations are given", async () => {
        await expect(
          contract.mintFour([0, 1, 2], [10, 10, 10])
        ).to.be.revertedWith("Only 2 tokens can be burned");
      });

      it("should revert forge when there is an invalid tokens", async () => {
        await expect(contract.mintFour([1, 0], [10, 10])).to.be.revertedWith(
          "invalid tokens"
        );
      });

      it("should revert forge when same amounts are not provided", async () => {
        await expect(contract.mintFour([1, 2], [10, 5])).to.be.revertedWith(
          "same amounts required"
        );
      });
    });

    context("mintFive", async () => {
      it("should forge five when the combination is correct", async () => {
        expect(await contract.getBalance(5)).to.be.equal(
          new BigNumber.from("0")
        );

        let tx = await contract.mintFive([0, 2], [5, 5]);
        await tx.wait();

        expect(await contract.getBalance(5)).to.be.equal(
          new BigNumber.from("5")
        );
      });

      it("should revert forge when more than 2 combinations are given", async () => {
        await expect(
          contract.mintFive([0, 1, 2], [10, 10, 10])
        ).to.be.revertedWith("Only 2 tokens can be burned");
      });

      it("should revert forge when there is an invalid tokens", async () => {
        await expect(contract.mintFive([0, 1], [10, 10])).to.be.revertedWith(
          "invalid tokens"
        );
      });

      it("should revert forge when same amounts are not provided", async () => {
        await expect(contract.mintFive([0, 2], [10, 5])).to.be.revertedWith(
          "same amounts required"
        );
      });
    });

    context("mintSix", async () => {
      it("should forge six when the combination is correct", async () => {
        expect(await contract.getBalance(6)).to.be.equal(
          new BigNumber.from("0")
        );

        let tx = await contract.mintSix([0, 1, 2], [5, 5, 5]);
        await tx.wait();

        expect(await contract.getBalance(6)).to.be.equal(
          new BigNumber.from("5")
        );
      });

      it("should revert forge when more/less than 3 combinations are given", async () => {
        await expect(contract.mintSix([0, 1], [10, 10])).to.be.revertedWith(
          "Only 3 tokens can be burned"
        );
      });

      it("should revert forge when there is an invalid tokens", async () => {
        await expect(contract.mintSix([0, 1, 3], [10, 10, 10])).to.be.revertedWith(
          "invalid tokens"
        );
      });

      it("should revert forge when same amounts are not provided", async () => {
        await expect(contract.mintSix([0, 1, 2], [10, 5, 10])).to.be.revertedWith(
          "same amounts required"
        );
      });
    });
  });
});

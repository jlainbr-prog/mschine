const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TetherToken", function () {
  let tetherToken;
  let owner;
  let addr1;
  let addr2;

  const initialSupply = ethers.utils.parseUnits("2600000000", 6);
  const tokenName = "Tether USD";
  const tokenSymbol = "USDT";
  const decimals = 6;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const TetherToken = await ethers.getContractFactory("TetherToken");
    tetherToken = await TetherToken.deploy(
      initialSupply,
      tokenName,
      tokenSymbol,
      decimals
    );
    await tetherToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tetherToken.owner()).to.equal(owner.address);
    });

    it("Should set the right token name", async function () {
      expect(await tetherToken.name()).to.equal(tokenName);
    });

    it("Should set the right token symbol", async function () {
      expect(await tetherToken.symbol()).to.equal(tokenSymbol);
    });

    it("Should set the right decimals", async function () {
      expect(await tetherToken.decimals()).to.equal(decimals);
    });

    it("Should assign the initial supply to owner", async function () {
      const ownerBalance = await tetherToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialSupply);
    });

    it("Should have correct total supply", async function () {
      const totalSupply = await tetherToken.totalSupply();
      expect(totalSupply).to.equal(initialSupply);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.utils.parseUnits("100", decimals);
      await tetherToken.transfer(addr1.address, transferAmount);

      const addr1Balance = await tetherToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const transferAmount = ethers.utils.parseUnits("1000000000000", decimals);
      await expect(
        tetherToken.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.reverted;
    });

    it("Should transfer tokens using transferFrom", async function () {
      const transferAmount = ethers.utils.parseUnits("50", decimals);
      
      // First approve the transfer
      await tetherToken.approve(addr1.address, transferAmount);
      
      // Then transfer using addr1
      await tetherToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      const addr2Balance = await tetherToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });
  });

  describe("Allowances", function () {
    it("Should set allowance correctly", async function () {
      const approveAmount = ethers.utils.parseUnits("100", decimals);
      await tetherToken.approve(addr1.address, approveAmount);

      const allowance = await tetherToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(approveAmount);
    });

    it("Should increase approval", async function () {
      const initialApprove = ethers.utils.parseUnits("100", decimals);
      const increase = ethers.utils.parseUnits("50", decimals);

      await tetherToken.approve(addr1.address, initialApprove);
      await tetherToken.increaseApproval(addr1.address, increase);

      const allowance = await tetherToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(initialApprove.add(increase));
    });

    it("Should decrease approval", async function () {
      const initialApprove = ethers.utils.parseUnits("100", decimals);
      const decrease = ethers.utils.parseUnits("30", decimals);

      await tetherToken.approve(addr1.address, initialApprove);
      await tetherToken.decreaseApproval(addr1.address, decrease);

      const allowance = await tetherToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(initialApprove.sub(decrease));
    });
  });

  describe("Pause Mechanism", function () {
    it("Should pause transfers", async function () {
      const transferAmount = ethers.utils.parseUnits("100", decimals);
      
      await tetherToken.pause();
      
      await expect(
        tetherToken.transfer(addr1.address, transferAmount)
      ).to.be.reverted;
    });

    it("Should unpause transfers", async function () {
      const transferAmount = ethers.utils.parseUnits("100", decimals);
      
      await tetherToken.pause();
      await tetherToken.unpause();
      
      await expect(tetherToken.transfer(addr1.address, transferAmount)).not.to.be.reverted;
    });

    it("Should only allow owner to pause", async function () {
      await expect(tetherToken.connect(addr1).pause()).to.be.reverted;
    });
  });

  describe("BlackList", function () {
    it("Should add address to blacklist", async function () {
      await tetherToken.addBlackList(addr1.address);
      
      const isBlacklisted = await tetherToken.getBlackListStatus(addr1.address);
      expect(isBlacklisted).to.equal(true);
    });

    it("Should remove address from blacklist", async function () {
      await tetherToken.addBlackList(addr1.address);
      await tetherToken.removeBlackList(addr1.address);
      
      const isBlacklisted = await tetherToken.getBlackListStatus(addr1.address);
      expect(isBlacklisted).to.equal(false);
    });

    it("Should prevent blacklisted addresses from transferring", async function () {
      const transferAmount = ethers.utils.parseUnits("100", decimals);
      
      // Transfer some tokens to addr1
      await tetherToken.transfer(addr1.address, transferAmount);
      
      // Add to blacklist
      await tetherToken.addBlackList(addr1.address);
      
      // Try to transfer - should fail
      await expect(
        tetherToken.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.reverted;
    });
  });

  describe("Issue and Redeem", function () {
    it("Should issue new tokens", async function () {
      const issueAmount = ethers.utils.parseUnits("1000000", decimals);
      const initialBalance = await tetherToken.balanceOf(owner.address);
      
      await tetherToken.issue(issueAmount);
      
      const finalBalance = await tetherToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance.add(issueAmount));
    });

    it("Should redeem tokens", async function () {
      const redeemAmount = ethers.utils.parseUnits("1000000", decimals);
      const initialBalance = await tetherToken.balanceOf(owner.address);
      
      await tetherToken.redeem(redeemAmount);
      
      const finalBalance = await tetherToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance.sub(redeemAmount));
    });

    it("Should update total supply on issue", async function () {
      const issueAmount = ethers.utils.parseUnits("1000000", decimals);
      const initialSupply = await tetherToken.totalSupply();
      
      await tetherToken.issue(issueAmount);
      
      const finalSupply = await tetherToken.totalSupply();
      expect(finalSupply).to.equal(initialSupply.add(issueAmount));
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await tetherToken.transferOwnership(addr1.address);
      
      expect(await tetherToken.owner()).to.equal(addr1.address);
    });

    it("Should only allow owner to transfer ownership", async function () {
      await expect(
        tetherToken.connect(addr1).transferOwnership(addr2.address)
      ).to.be.reverted;
    });
  });

  describe("Events", function () {
    it("Should emit Transfer event", async function () {
      const transferAmount = ethers.utils.parseUnits("100", decimals);
      
      await expect(tetherToken.transfer(addr1.address, transferAmount))
        .to.emit(tetherToken, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("Should emit Approval event", async function () {
      const approveAmount = ethers.utils.parseUnits("100", decimals);
      
      await expect(tetherToken.approve(addr1.address, approveAmount))
        .to.emit(tetherToken, "Approval")
        .withArgs(owner.address, addr1.address, approveAmount);
    });

    it("Should emit Pause event", async function () {
      await expect(tetherToken.pause())
        .to.emit(tetherToken, "Pause");
    });

    it("Should emit Issue event", async function () {
      const issueAmount = ethers.utils.parseUnits("1000000", decimals);
      
      await expect(tetherToken.issue(issueAmount))
        .to.emit(tetherToken, "Issue")
        .withArgs(issueAmount);
    });
  });
});

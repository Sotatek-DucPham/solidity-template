import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import hre from "hardhat";
import { Greeter } from "../../typechain/Greeter";

const { loadFixture } = hre.waffle;

describe("Unit tests", () => {
  let admin: SignerWithAddress;
  let greeter: Greeter;
  before(async () => {
    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    admin = signers[0];
  });

  describe("Greeter", () => {
    const fixture = async () => {
      const greeting: string = "Hello, world!";
      const Greeter = await hre.ethers.getContractFactory("Greeter");
      return (await Greeter.connect(admin).deploy(greeting)) as Greeter;
    };

    beforeEach(async () => {
      greeter = await loadFixture(fixture);
    });

    it("should return the new greeting once it's changed", async () => {
      expect(await greeter.connect(admin).greet()).to.equal("Hello, world!");

      await greeter.setGreeting("Bonjour, le monde!");
      expect(await greeter.connect(admin).greet()).to.equal("Bonjour, le monde!");
    });
  });
});

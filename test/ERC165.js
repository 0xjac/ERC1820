const TestRPC = require('ganache-cli');
const Web3 = require('web3');
const chai = require('chai');
const assert = chai.assert;

const ERC1820 = require('../index.js');
const artifacts = require('../js/artifacts')();

const ERC165_ID = '0x01ffc9a7';
const INVALID_ID = '0xffffffff';
const SIMPSON_ID = '0x73B6B492';

describe('ERC165 Compatibility Test', function() {
    let testrpc;
    let web3;
    let accounts;
    let erc1820Registry;
    let addr;
    let manager1;
    let manager2;
    let lisa;
    let homer;

    this.slow(300);
    this.timeout(6000);

    before(async () => {
        testrpc = TestRPC.server({
            ws: true,
            gasLimit: 5800000,
            total_accounts: 10,
        });

        testrpc.listen(8546, '127.0.0.1');

        web3 = new Web3('ws://127.0.0.1:8546');
        accounts = await web3.eth.getAccounts();
        addr = accounts[0];
        manager1 = accounts[2];
        manager2 = accounts[3];
    });

    after(async () => testrpc.close());

    it('should deploy ERC1820', async () => {
        erc1820Registry = await ERC1820.deploy(web3, accounts[0]);
        assert.ok(erc1820Registry.options.address);
        assert.equal(erc1820Registry.options.address, "0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24");
    });

    it('should return noInterface for LegacyNoCB', async () => {
        const c = await artifacts.contracts.TestERC165.LegacyNoCB.deploy(web3);
        assert.ok(c.options.address);
        const r = await erc1820Registry.methods.implementsERC165InterfaceNoCache(c.options.address, ERC165_ID).call();
        assert.isFalse(r);
    });


    it('should return noInterface for LegacyCBNoReturn', async () => {
        const c = await artifacts.contracts.TestERC165.LegacyCBNoReturn.deploy(web3);
        assert.ok(c.options.address);
        const r = await erc1820Registry.methods.implementsERC165InterfaceNoCache(c.options.address, ERC165_ID).call();
        assert.isFalse(r);
    });

    it('should return noInterface for LegacyCBReturnTrue', async () => {
        const c = await artifacts.contracts.TestERC165.LegacyCBReturnTrue.deploy(web3);
        assert.ok(c.options.address);
        const r = await erc1820Registry.methods.implementsERC165InterfaceNoCache(c.options.address, ERC165_ID).call();
        assert.isFalse(r);
    });

    it('should return noInterface for LegacyCBReturnFalse', async () => {
        const c = await artifacts.contracts.TestERC165.LegacyCBReturnFalse.deploy(web3);
        assert.ok(c.options.address);
        const r = await erc1820Registry.methods.implementsERC165InterfaceNoCache(c.options.address, ERC165_ID).call();
        assert.isFalse(r);
    });

    it('should return true on a good impl of ERC165 Lisa', async () => {
        lisa = await artifacts.contracts.TestERC165.Lisa.deploy(web3);
        assert.ok(lisa.options.address);
        assert.isTrue(await lisa.methods.supportsInterface(ERC165_ID).call());
        assert.isFalse(await lisa.methods.supportsInterface(INVALID_ID).call());
        assert.isTrue(await lisa.methods.supportsInterface(SIMPSON_ID).call());

        assert.isTrue(
          await erc1820Registry.methods.implementsERC165InterfaceNoCache(lisa.options.address, ERC165_ID).call());
        assert.isFalse(
          await erc1820Registry.methods.implementsERC165InterfaceNoCache(lisa.options.address, INVALID_ID).call());
        assert.isTrue(
          await erc1820Registry.methods.implementsERC165InterfaceNoCache(lisa.options.address, SIMPSON_ID).call());
    });

    it('should return true on a good impl of ERC165 Homer', async () => {
        homer = await artifacts.contracts.TestERC165.Homer.deploy(web3);
        assert.ok(homer.options.address);
        assert.isTrue(await homer.methods.supportsInterface(ERC165_ID).call());
        assert.isFalse(await homer.methods.supportsInterface(INVALID_ID).call());
        assert.isTrue(await homer.methods.supportsInterface(SIMPSON_ID).call());
        assert.isTrue(
          await erc1820Registry.methods.implementsERC165InterfaceNoCache(homer.options.address, ERC165_ID).call());
        assert.isFalse(
          await erc1820Registry.methods.implementsERC165InterfaceNoCache(homer.options.address, INVALID_ID).call());
        assert.isTrue(
          await erc1820Registry.methods.implementsERC165InterfaceNoCache(homer.options.address, SIMPSON_ID).call());
    });

    it('should be compatible with ERC1820', async () => {
        const gasBefore = await erc1820Registry.methods
          .getInterfaceImplementer(lisa.options.address, SIMPSON_ID).estimateGas();
        const responseBefore = await erc1820Registry.methods
          .getInterfaceImplementer(lisa.options.address, SIMPSON_ID).call();
        assert.equal(responseBefore, lisa.options.address);

        await erc1820Registry.methods.updateERC165Cache(lisa.options.address, SIMPSON_ID).send({ from: addr });

        const gasAfter = await erc1820Registry.methods
          .getInterfaceImplementer(lisa.options.address, SIMPSON_ID).estimateGas();
        const responseAfter = await erc1820Registry.methods
          .getInterfaceImplementer(lisa.options.address, SIMPSON_ID).call();
        assert.equal(responseAfter, lisa.options.address);

        assert.isBelow(gasAfter, gasBefore, "Gas after caching should be lower.");
    });
});

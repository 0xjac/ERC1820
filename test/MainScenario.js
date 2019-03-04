const TestRPC = require('ganache-cli');
const Web3 = require('web3');
const chai = require('chai');
const assert = chai.assert;
chai.use(require('chai-as-promised')).should();

const ERC820a = require('../index.js');
const artifacts = require('../js/artifacts')();
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe('ERC820a Test', function() {
    let testrpc;
    let web3;
    let accounts;
    let erc820aRegistry;
    let addr;
    let implementer;
    let client;
    let manager1;
    let manager2;
    let interfaceHash;

    this.slow(120);
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

    it('should deploy ERC820a', async () => {
        erc820aRegistry = await ERC820a.deploy(web3, accounts[0]);
        assert.ok(erc820aRegistry.options.address);
        assert.equal(erc820aRegistry.options.address, "0x820a4875aA7900995D6f4ed84ab66651dd582aef");
    });

    it('should deploy the example implementer', async () => {
        implementer = await artifacts.contracts.ExampleImplementer.ExampleImplementer.deploy(web3);
        assert.ok(implementer.options.address);
    });

    it('should deploy the example client', async () => {
        client = await artifacts.contracts.ExampleClient.ExampleClient.deploy(web3);
        assert.ok(client.options.address);
    });

    it('should set an address', async () => {
        interfaceHash = await erc820aRegistry.methods.interfaceHash("TestIface").call();
        assert.equal(interfaceHash, web3.utils.sha3("TestIface"));
        await erc820aRegistry.methods
          .setInterfaceImplementer(addr, interfaceHash, implementer.options.address).send({from: addr});
        const implementerAddress = await erc820aRegistry.methods.getInterfaceImplementer(addr, interfaceHash).call();
        assert.equal(implementerAddress, implementer.options.address);
    });

    it('should change manager', async () => {
        await erc820aRegistry.methods.setManager(addr, manager1).send({ from: addr });
        const managerAddress = await erc820aRegistry.methods.getManager(addr).call();
        assert.equal(managerAddress, manager1);
    });
    //
    it('manager should remove interface', async() => {
        await (erc820aRegistry.methods
          .setInterfaceImplementer(addr, interfaceHash, ZERO_ADDRESS).send({from: manager1, gas: 200000}));
        const implementerAddress = await erc820aRegistry.methods.getInterfaceImplementer(addr, interfaceHash).call();
        assert.equal(implementerAddress, ZERO_ADDRESS);
    });

    it('address should change back the interface', async() => {
        await erc820aRegistry.methods
          .setInterfaceImplementer(addr, interfaceHash, implementer.options.address).send({from: manager1});
        const implementerAddress = await erc820aRegistry.methods.getInterfaceImplementer(addr, interfaceHash).call();
        assert.equal(implementerAddress, implementer.options.address);
    });

    it('manager should change manager', async() => {
        await erc820aRegistry.methods.setManager(addr, manager2).send({from: manager1});
        const rManager2 = await erc820aRegistry.methods.getManager(addr).call();
        assert.equal(rManager2, manager2);
    });

    it('address should remove interface', async() => {
        await erc820aRegistry.methods
          .setInterfaceImplementer(addr, interfaceHash, ZERO_ADDRESS).send({from: manager2, gas: 200000});
        const implementerAddress = await erc820aRegistry.methods.getInterfaceImplementer(addr, interfaceHash).call();
        assert.equal(implementerAddress, ZERO_ADDRESS);
    });

    it('should not allow to set an invalid implementer for an address', async() => {
        await erc820aRegistry.methods
          .setInterfaceImplementer(addr, interfaceHash, erc820aRegistry.options.address)
          .send({from: manager2, gas: 200000})
          .should.be.rejectedWith('revert');
    });

    it('manager should set back interface', async() => {
        await erc820aRegistry.methods
          .setInterfaceImplementer(addr, interfaceHash, implementer.options.address)
          .send({from: manager2, gas: 200000});
        const implementerAddress = await erc820aRegistry.methods.getInterfaceImplementer(addr, interfaceHash).call();
        assert.equal(implementerAddress, implementer.options.address);
    });

    it('address should remove manager', async() => {
        await erc820aRegistry.methods.setManager(addr, ZERO_ADDRESS).send({from: manager2, gas: 200000});
        const managerAddress = await erc820aRegistry.methods.getManager(addr).call();
        assert.equal(managerAddress, addr);
    });

    it('manager should not be able to change interface', async() => {
        await erc820aRegistry.methods
          .setInterfaceImplementer(addr, interfaceHash, ZERO_ADDRESS).send({from: manager2, gas: 200000})
          .should.be.rejectedWith('revert');
    });
});

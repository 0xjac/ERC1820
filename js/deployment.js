const ethTx = require('ethereumjs-tx');
const ethUtils = require('ethereumjs-util');
const { ERC1820Registry } = require('../artifacts/contracts/js/ERC1820Registry.js');

//const artifacts = require('./artifacts')();
const rawTransaction = require('./rawTransaction');



generateDeployTx = () => {
    const tx = new ethTx(rawTransaction);
    const res = {
        sender: ethUtils.toChecksumAddress(tx.getSenderAddress().toString('hex')),
        rawTx: '0x' + tx.serialize().toString('hex'),
        contractAddr: ethUtils.toChecksumAddress(
          ethUtils.generateAddress(tx.getSenderAddress(), ethUtils.toBuffer(0)).toString('hex')),
    };
    return res;
};


deploy = async (eth, account = undefined) => {
    const res = generateDeployTx();

    const deployedCode = await eth.getCode(res.contractAddr);
    if (!account) {
        account = (await eth.getAccounts())[0]
    }

    if (deployedCode.length <=3 ) {
        await eth.sendTransaction({
          from: account, to: res.sender, value: '100000000000000000'/* web3.utils.toWei(0.1) */
        });
        await eth.sendSignedTransaction(res.rawTx);
    }
    return new ERC1820Registry(eth, res.contractAddr);
};



module.exports.generateDeployTx = generateDeployTx;
module.exports.deploy = deploy;

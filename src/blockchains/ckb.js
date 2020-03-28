const CKB = require('@nervosnetwork/ckb-sdk-core').default;
const cryptoRandomString = require('crypto-random-string');

const nodeUrl = 'http://47.56.237.128:4114';

const ckb = new CKB(nodeUrl);

module.exports = {
	ckb: ckb,
	createAccount: () => {
		var privateKey = '0x' + cryptoRandomString({length: 64});
		var publicKey = ckb.utils.privateKeyToPublicKey(privateKey);
		var address = ckb.utils.pubkeyToAddress(publicKey, {
      prefix: 'ckt'
    });
    return {
    	privateKey: privateKey,
    	publicKey: publicKey,
    	address: address
    }
	}
}


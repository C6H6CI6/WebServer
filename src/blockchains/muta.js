const { Muta, Account } = require('muta-sdk/build/main');

const muta = new Muta({
	chainId: "0xb6a4d7da21443f5e816e8700eea87610e6d769657d6b8ec73028457bf2ca4036",
	endpoint: "http://47.56.237.128:4321/graphql"
});
const client = muta.client();

module.exports = {
	generateAccount: function() {
		const mnemonic = Muta.hdWallet.generateMnemonic();
		const wallet = new Muta.hdWallet(mnemonic);
		const privateKey = wallet.derivePrivateKey(1);
		const account = Account.fromPrivateKey(privateKey);
		return {
			privateKey: privateKey.toString('hex'),
			address: account.address,
			publicKey: account.publicKey
		}
	},
	client: client,
	getAccount: Account.fromPrivateKey
}
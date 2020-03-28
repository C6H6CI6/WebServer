const ckb = require('../blockchains/ckb');
const muta = require('../blockchains/muta');
const { Muta } = require("muta-sdk");
const { exec } = require("child_process");

const client = muta.client;


exports.cashIn = function (req, res, next) {
	const account = Muta.accountFromPrivateKey(
		req.body.secret_key, // my private key
	);

	var cmd = "ckb-cli --wait-for-sync --url http://47.56.237.128:4114 cross-chain issue --amount " + req.body.amount;
	console.log(cmd);
	exec(cmd, function(err, stdout, stderr) {
		if(err) {
			console.log(err);
			res.json({
				error: 0,
				msg: err
			})
		} else {
			cmd = "ckb-cli --wait-for-sync --url http://47.56.237.128:4114 cross-chain charge --amount " +
				req.body.amount + " --muta-address " + account.address;
			console.log(cmd);
			exec(cmd, function(err, stdout1, stderr1) {
					if(err) {
						console.log(err);
						res.json({
							error: 0,
							msg: err
						});
					} else {
						console.log(stdout);
						console.log(stderr);
						console.log(stdout1);
						console.log(stderr1);
						res.json({
							error: 0,
							message: stdout + "\n" + stdout1,
							err_message: stderr + "\n" + stderr1
						})
					}
				});
		}
	});
	/*
	const buf = Buffer.alloc(9);
	buf.writeUInt8(1);
	buf.writeBigUInt64LE(BigInt(req.body.amount), 1);
	const amountHex = buf.toString('hex');

	async function exec() {
		const tx = await client.composeTransaction({
			serviceName: "mulimuli",
			method: "create_asset",
			payload: {
				ckb_tx: {
					version: "0x2",
					cell_deps: [],
					header_deps: [],
					inputs: [],
					outputs: [],
					outputs_data: [
						'0x' +
						amountHex +
						account.address.substring(2),
					],
					witnesses: [],
				},
				indices: [],
				lemmas: [],
			}
		});

		const signedTx = account.signTransaction(tx);
		const txHash = await client.sendTransaction(signedTx);
		return await client.getReceipt(txHash);

	}

	exec().then(receipt => {
		console.log(receipt)
		res.json(receipt);
	}).catch(console.error)
	*/
}

exports.cashOut = function (req, res, next) {

	const account = Muta.accountFromPrivateKey(
		req.body.secret_key, // my private key
	);

	cmd = "ckb-cli --wait-for-sync --url http://47.56.237.128:4114 cross-chain withdraw --amount " +
		req.body.amount + " --muta-address " + account.address;

	console.log(cmd);
	exec(cmd, function(err, stdout, stderr) {
			if(err) {
				console.log(err);
				res.json({
					error: 0,
					msg: err
				});
			} else {
				console.log(stdout);
				console.log(stderr);
				res.json({
					error: 0,
					message: stdout,
					err_message: stderr
				})
			}
		});

	/*
	const buf = Buffer.alloc(9);
	buf.writeUInt8(1);
	buf.writeBigUInt64LE(BigInt(req.body.amount), 1);
	const amountHex = buf.toString('hex');
	const account = Muta.accountFromPrivateKey(
		req.body.secret_key, // my private key
	);

	async function exec() {
		const tx = await client.composeTransaction({
			serviceName: "mulimuli",
			method: "burn_asset",
			payload: {
				ckb_tx: {
					version: "0x2",
					cell_deps: [],
					header_deps: [],
					inputs: [],
					outputs: [],
					outputs_data: [
						'0x' +
						amountHex +
						account.address.substring(2),
					],
					witnesses: [],
				},
				indices: [],
				lemmas: [],
			}
		});

		const signedTx = account.signTransaction(tx);
		const txHash = await client.sendTransaction(signedTx);
		return await client.getReceipt(txHash);
	}

	exec().then(receipt => {
		console.log(receipt)
		res.json(receipt);
	}).catch(console.error)
	*/
}

exports.stakeIn = function (req, res, next) {
	const buf = Buffer.alloc(9);
	buf.writeUInt8(1);
	buf.writeBigUInt64LE(BigInt(req.body.amount), 1);
	const amountHex = buf.toString('hex');

	const [sk, blsPk] = req.body.secret_key.split("\n");
	const account = Muta.accountFromPrivateKey(
		sk, // my private key
	);

	async function exec() {
		const tx = await client.composeTransaction({
			serviceName: "mulimuli",
			method: "deposit",
			payload: {
				ckb_tx: {
					version: "0x2",
					cell_deps: [],
					header_deps: [],
					inputs: [],
					outputs: [],
					outputs_data: [
						'0x' +
						amountHex +
						account.address.substring(2) +
						blsPk.substring(2),
					],
					witnesses: [],
				},
				indices: [],
				lemmas: [],
			}
		});

		const signedTx = account.signTransaction(tx);
		const txHash = await client.sendTransaction(signedTx);
		return await client.getReceipt(txHash);
	}

	exec().then(receipt => {
		console.log(receipt)
		res.json(receipt);
	}).catch(console.error)
}

exports.stakeOut = function (req, res, next) {
	const buf = Buffer.alloc(9);
	buf.writeUInt8(1);
	buf.writeBigUInt64LE(BigInt(req.body.amount), 1);
	const amountHex = buf.toString('hex');

	const [sk, blsPk] = req.body.secret_key.split("\n");
	const account = Muta.accountFromPrivateKey(
		sk, // my private key
	);

	async function exec() {
		const tx = await client.composeTransaction({
			serviceName: "mulimuli",
			method: "refund",
			payload: {
				ckb_tx: {
					version: "0x2",
					cell_deps: [],
					header_deps: [],
					inputs: [],
					outputs: [],
					outputs_data: [
						'0x' +
						amountHex +
						account.address.substring(2) +
						blsPk.substring(2),
					],
					witnesses: [],
				},
				indices: [],
				lemmas: [],
			}
		});

		const signedTx = account.signTransaction(tx);
		const txHash = await client.sendTransaction(signedTx);
		return await client.getReceipt(txHash);
	}

	exec().then(receipt => {
		console.log(receipt)
		res.json(receipt);
	}).catch(console.error)
}

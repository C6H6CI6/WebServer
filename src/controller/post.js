const { Posts } = require('../models/post');
const muta = require('../blockchains/muta');
const cryptoRandomString = require('crypto-random-string');
client = muta.client;

exports.getNewPosts = (req, res, next) => {

	Posts.find().then(item => {
		item.sort((a, b) => {
			return a.updatedAt < b.updatedAt ? 1 : (a.updatedAt > b.updatedAt ? -1 : 0);
		})
		postsResponse = item;
		res.json({
			error: 0,
			data: postsResponse
		});
	});

};

exports.createTransaction = async function(req, res, next) {
	client.composeTransaction({
		method: req.query.method,
		payload: req.query.payload,
		serviceName: 'mulimuli',
		timeout: "0x" + ((await client.getLatestBlockHeight()) + 20).toString(16)
	}).then(tx => {
		console.log("Composed transaction:");
		console.log(tx);
		res.json({
			error: 0,
			data: tx
		});
	});
}

exports.createPost = function(req, res, next) {
	if(!req.session.logged_in) {
		res.json({
			error: 1,
			msg: "Not logged in"
		});
		return;
	}
	if(req.body.address != req.session.logged_in.muta_address) {
		console.log("Expected address: " + req.session.logged_in.muta_address);
		console.log("Got address: " + req.body.address);
		res.json({
			error: 1,
			msg: "Invalid address"
		});
		return;
	}
	var tx = JSON.parse(req.body.transaction);
	console.log(tx);
	client.sendTransaction(tx).then(async id => {
		console.log("Id = " + id);
		console.log("Data returned from star method:")
		console.log(id);
		receipt = await client.getReceipt(id);
		console.log("Receipt:");
		console.log(receipt);
		if(receipt.response.isError) {
			res.json({error: 1, msg: "Receipt shows error"});
			return;
		}
		var ret = JSON.parse(receipt.response.ret);
		console.log(ret);
		post = {
			"id": ret.id,
			"title": req.body.title,
			"content": req.body.content,
			"summary": req.body.content,
			"image": req.body.image,
			"date": req.body.date,
			"author": req.session.logged_in.name,
			"n_thumbups": 0,
			"n_comments": 0,
			"n_tokens": 0
		};
		Posts.create(post);
		res.json({
			error: 0
		})
	});
}

exports.starPost = function(req, res, next) {
	if(!req.session.logged_in) {
		res.json({
			error: 1,
			msg: "Not logged in"
		});
		return;
	}

	if(parseInt(req.body.amount) <= 0) {
		res.json({
			error: 1,
			msg: "Amount cannot be negative or zero"
		});
		return;
	}
	var tx = JSON.parse(req.body.transaction);
	console.log(tx);
	client.sendTransaction(tx).then(async data => {
		console.log("Data returned from star method:")
		console.log(data);
		receipt = await client.getReceipt(data);
		console.log("Receipt:");
		console.log(receipt);

		if(receipt.response.isError) {
			res.json({
				error: 1,
				msg: "Something wrong with the transaction"
			});
			return;
		}
		posts = await Posts.find({"id": req.body.post_id});
		console.log("Found posts with id " + req.body.post_id)
		console.log(posts);
		if(posts.length == 0) {
			res.json({
				error: 1,
				msg: "Invalid post id " + req.body.post_id
			});
			return;
		}
		post = posts[0];
		console.log(req.body);
		post.n_tokens = post.n_tokens + parseInt(req.body.amount);
		Posts.findOneAndUpdate({
			"id": req.body.post_id
		}, post, function(err, raw) {
      if (err) {
        console.log('Error log: ' + err)
      }
		});
		res.json({
			error: 0
		})
	});
}
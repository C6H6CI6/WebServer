const { User } = require('../models/user');
const muta = require('../blockchains/muta');
const ckb = require('../blockchains/ckb');

const client = muta.client;

async function getUserTokens(address) {
  var request = {
    caller: address,
    method: 'get_balance',
    payload: '',
    serviceName: 'mulimuli',
  };
  console.log(request);
  var response = await client.queryServiceDyn(request);
  console.log(response);
  if(response.isError) {
    return 0;
  }
  return response.ret.balance;
}

async function getUser(name) {
  try {
    var items = await User.find({name: name});
    console.log(items);
    for (var i = 0; i < items.length; i++) {
      if(items[i].name == name) {
        items[i].error = 0;
        var tokens = await getUserTokens(items[i].muta_address);
        items[i].n_tokens = tokens;
        console.log("Found user: " + name)
        console.log(items[i]);
        return items[i];
      }
    }
    console.log("User " + name + " Not found");
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function (req, res, next) {
  if(req.session.logged_in) {
    User.find({name: req.session.logged_in.name}).then(async function (items) {
      console.log(items);
      for (var i = 0; i < items.length; i++) {
        if(items[i].name == req.session.logged_in.name) {
          var tokens = await getUserTokens(items[i].muta_address);
          items[i].n_tokens = tokens;
          res.json({
            error: 0,
            data: items[i]
          });
          return;
        }
      }
      res.json({
        error: 1,
        msg: "User name not found"
      })
    })
    .catch ((error) => {
      console.log("Error in rendering users!\n" + error);
      res.status(500).send('Internal Server Error');
    });
  } else {
    res.json({"error": 1});
  }

};

exports.getUser = getUser;

exports.createUser = function(req, res, next) {
  if(req.query.secret_key) {
    var mutaAccount = muta.getAccount(req.query.secret_key);
    muta_account = {
      privateKey: req.query.secret_key,
      address: mutaAccount.address,
      publicKey: mutaAccount.publicKey
    };
  } else {
    muta_account = muta.generateAccount();
  }
  var ckb_account = ckb.createAccount();
  console.log(muta_account);
  console.log(ckb_account);
  user = {
    "name": req.query.name,
    "avatar": "assets/avatar.jpg",
    "ckb_address": ckb_account.address,
    "ckb_public_key": ckb_account.publicKey,
    "muta_address": muta_account.address,
    "muta_public_key": muta_account.publicKey,
    "n_likes": 0,
    "n_comments": 0,
    "n_tokens": 0
  };
  console.log(user);
  User.create(user);
  res.json({
    error: 0
  });
}

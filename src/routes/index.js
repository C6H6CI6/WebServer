const express = require('express');
const router = express.Router();

const usersRouter = require('../controller/user');
const loginRouter = require('../controller/login');
const postsRouter = require('../controller/post');
const udtRouter = require('../controller/udt');

/**
 * Primary app routes.
 */
router.get('/users', usersRouter.getAccount);
router.get('/create-user', usersRouter.createUser);
router.get('/login-request', loginRouter.requestLogin);
router.post('/login', loginRouter.login);

router.get('/posts', postsRouter.getNewPosts);
router.post('/submit-post', postsRouter.createPost);
router.get('/create-transaction', postsRouter.createTransaction);
router.post('/star', postsRouter.starPost);

router.post('/cash-in', udtRouter.cashIn);
router.post('/cash-out', udtRouter.cashOut);

router.post('/stake-in', udtRouter.stakeIn);
router.post('/stake-out', udtRouter.stakeOut);

module.exports = router;

const express = require ('express');
const router = express.Router();

const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');

router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/topics', topicsRouter);
router.use('/users', usersRouter);

module.exports = router;


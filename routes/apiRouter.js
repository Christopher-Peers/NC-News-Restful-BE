const express = require ('express');
const router = express.Router();

const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./articlesRouter');
const topicsRouter = require('./articlesRouter');
const usersRouter = require('./articlesRouter');

router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);
router.use('/topics', topicsRouter);
router.use('/users', usersRouter);

module.exports = router;


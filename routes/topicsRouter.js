const express = require ('express');
const router = express.Router();
const { getAllTopics, getArticlesByTopic } = require('../controllers/topicControllers');

router.get('/', getAllTopics);
router.get('/:topic/articles', getArticlesByTopic);

module.exports = router;


const express = require('express');
const router = express.Router();
const { getAllArticles, getArticleComments, postNewArticleComment, changeArticleVote } = require('../controllers/articleControllers');


router.get('/', getAllArticles);
router.put('/:article_id', changeArticleVote);
router.route('/:article_id/comments')
  .get(getArticleComments)
  .post(postNewArticleComment);


module.exports = router;


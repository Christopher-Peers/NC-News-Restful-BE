const express = require('express');
const router = express.Router();
const { 
  getAllArticles,
  getSingleArticle, 
  getArticleComments, 
  postNewArticleComment, 
  changeArticleVote } = require('../controllers/articleControllers');


router.get('/', getAllArticles);
router.route('/:article_id')
  .get(getSingleArticle)
  .put(changeArticleVote);
router.route('/:article_id/comments')
  .get(getArticleComments)
  .post(postNewArticleComment);


module.exports = router;


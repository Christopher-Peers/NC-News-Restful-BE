const express = require ('express');
const router = express.Router();
const { getAllArticles, getArticleComments, postNewArticleComment } = require('../controllers/');


router.get('/', getAllArticles);
router.route('/:article_id/comments')
    .get(getArticleComments)
    .post(postNewArticleComment)


module.exports = router;


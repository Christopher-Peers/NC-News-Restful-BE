const mongoose = require('mongoose');

const Articles = require('../models/articles');
const Comments = require('../models/comments');

const { checkVotesError, checkPostCommentError, checkIdError } = require('./helpers');

// =========================================================

function getAllArticles(req, res, next) {

  let articlesArray = []

  return Articles.find().lean()
    .then(articles => {
      articlesArray = articles;
      const commentCount = articles.map(article => {
        return Comments.find({ belongs_to: article._id }).count();
      });

      return Promise.all(commentCount)
        .then(commentsLength => {
          return articlesArray.map((article, i) => {
            article.comments = commentsLength[i];
            return article;
          });
        });

    })
    .then(articles => {
      res.status(200).json({ articles });
    })
    .catch(next);
}

function getSingleArticle(req, res, next) {

  const articleId = req.params.article_id;
  if (!mongoose.Types.ObjectId.isValid(articleId)) return next({ name: 'invalidId', value: articleId });

  return Articles.findById(articleId).lean()
    .then(article => {

      let idErrorCheck = checkIdError(articleId, article);
      if (idErrorCheck !== undefined) return next(idErrorCheck);

      res.status(200).json({ articles: [article] });
    })
    .catch(next);

}

function getArticleComments(req, res, next) {

  const articleId = req.params.article_id;
  if (!mongoose.Types.ObjectId.isValid(articleId)) return next({ name: 'invalidId', value: articleId });

  return Comments.find({ belongs_to: articleId }).lean()
    .then(commentsForArticle => {

      let idErrorCheck = checkIdError(articleId, commentsForArticle);
      if (idErrorCheck !== undefined) return next(idErrorCheck);

      res.status(200).json({ comments: commentsForArticle });
    })
    .catch(next);

}

function postNewArticleComment(req, res, next) {

  const articleId = req.params.article_id;
  if (!mongoose.Types.ObjectId.isValid(articleId)) return next({ name: 'invalidId', value: articleId });

  const newComment = new Comments({
    body: req.body.comment,
    belongs_to: articleId,
    created_by: 'northcoder', // hardcoded fix this to accept a user
    votes: 0,
    created_at: Date.now()
  });

  let postErrorCheck = checkPostCommentError(newComment); // still hardcoded for now
  if (postErrorCheck !== undefined) return next(postErrorCheck);

  return Articles.findById(articleId).lean()
    .then(article => {

      let idErrorCheck = checkIdError(articleId, article);
      if (idErrorCheck !== undefined) return next(idErrorCheck);

      return newComment.save()
        .then(newComment => {

          let idErrorCheck = checkIdError(articleId, newComment);
          if (idErrorCheck !== undefined) return next(idErrorCheck);

          res.status(201).json({ comment: newComment });
        })
        .catch(next);

    })
    .catch(next);

}

function changeArticleVote(req, res, next) {

  const articleId = req.params.article_id;
  const voteDirection = req.query.vote;
  let modifier;
  if (!mongoose.Types.ObjectId.isValid(articleId)) return next({ name: 'invalidId', value: articleId });

  let voteErrorCheck = checkVotesError(req.query);
  if (voteErrorCheck !== undefined) return next(voteErrorCheck);

  if (voteDirection === 'up') modifier = 1;
  else if (voteDirection === 'down') modifier = -1;

  return Articles.findByIdAndUpdate(articleId, { $inc: { votes: modifier } }, { new: true })
    .then(updatedArticleVotes => {

      let idErrorCheck = checkIdError(articleId, updatedArticleVotes);
      if (idErrorCheck !== undefined) return next(idErrorCheck);

      res.status(202).json(updatedArticleVotes);
    })
    .catch(next);

}

module.exports = {
  getAllArticles,
  getSingleArticle,
  getArticleComments,
  postNewArticleComment,
  changeArticleVote
};
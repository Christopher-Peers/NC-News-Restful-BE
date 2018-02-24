const Articles = require('../models/articles');
const Comments = require('../models/comments');

function getAllArticles(req, res, next) {
  console.log('getAllArticles called');

  let articlesArray = []

  return Articles.find().lean()
    .then(articles => {
      articlesArray = articles;
      const commentCount = articles.map(article => {
        return Comments.find({ belongs_to: article._id }).count();
      })

      return Promise.all(commentCount)
        .then(commentsLength => {
          return articlesArray.map((article, i) => {
            article.comments = commentsLength[i];
            return article;
          });
        })

    })
    .then(articles => {
      res.status(200).json({ articles });
    })
    .catch(next);
}

function getArticleComments(req, res, next) {
  console.log('getArticleComments called');

  return Comments.find({ belongs_to: req.params.article_id }).lean()
    .then(commentsForArticle => {
      res.status(200).json({ commentsForArticle })
    })
    .catch(next)
}

function postNewArticleComment(req, res, next) {
  console.log('postNewArticleComment called');

  const newComment = new Comments ({
    body: req.body.text,
    belongs_to: req.params.article_id,
    created_by: 'northcoder', // hardcoded fix this to accept a user
    votes: 0,
    created_at: Date.now()
  })

  return newComment.save()
  .then(newComment => { res.status(201).json(newComment) })
  .catch(next);
}

function changeArticleVote(req, res, next) {
  console.log('changeArticleVote called')
  
  const articleId = req.params.article_id
  let modifier;
  if (req.query.vote === 'up') modifier = 1;
  else if (req.query.vote === 'down') modifier = -1;
  // else // create an error to pass to error handling middleware once written

  return Articles.findByIdAndUpdate(articleId, { $inc: {votes : modifier} }, { new: true })
    .then(updatedArticleVotes => {      
      res.status(200).json(updatedArticleVotes) // better status code?
    })
    .catch(next)

}

module.exports = { getAllArticles, getArticleComments, postNewArticleComment, changeArticleVote }
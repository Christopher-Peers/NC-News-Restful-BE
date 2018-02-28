const Comments = require('../models/comments');

const { checkDeleteCommentError, checkVotesError } = require('./helpers');

// =============================================

function changeCommentVote(req, res, next) {

  const commentId = req.params.comment_id;
  const voteDirection = req.query.vote;
  let modifier;

  let errorCheck = checkVotesError(req.query);
  if (errorCheck !== undefined) return next(errorCheck);

  if (voteDirection === 'up') modifier = 1;
  else if (voteDirection === 'down') modifier = -1;

  return Comments.findByIdAndUpdate(commentId, { $inc: { votes: modifier } }, { new: true })
    .then(updatedCommentVotes => {
      res.status(202).json(updatedCommentVotes); 
    })
    .catch(next);
}

function deleteUserComment(req, res, next) {

  const commentId = req.params.comment_id;
  
  Comments.findById(commentId).lean()
    .then(comment => {

      let deleteErrorCheck = checkDeleteCommentError(comment, 'northcoder', commentId);
      if (deleteErrorCheck !== undefined) return next(deleteErrorCheck);

      Comments.findByIdAndRemove(commentId)
        .then(deletedComment => {
          res.status(202).json({message: `comment with the id ${commentId} has been deleted`}); // No content - successfully processed but no return content
        })
        .catch(next);
    })
    .catch(next);
}

module.exports = { changeCommentVote, deleteUserComment };
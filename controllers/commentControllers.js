const mongoose = require('mongoose');
const Comments = require('../models/comments');

const { checkDeleteCommentError, checkVotesError, checkIdError } = require('./helpers');

// =============================================

function changeCommentVote(req, res, next) {

  const commentId = req.params.comment_id;
  const voteDirection = req.query.vote;
  let modifier;
  if (!mongoose.Types.ObjectId.isValid(commentId)) return next({ name: 'invalidId', value: commentId });

  let errorCheck = checkVotesError(req.query);
  if (errorCheck !== undefined) return next(errorCheck);

  if (voteDirection === 'up') modifier = 1;
  else if (voteDirection === 'down') modifier = -1;

  return Comments.findByIdAndUpdate(commentId, { $inc: { votes: modifier } }, { new: true })
    .then(updatedCommentVotes => {

      let idErrorCheck = checkIdError(commentId, updatedCommentVotes);
      if (idErrorCheck !== undefined) return next(idErrorCheck);
      res.status(202).json(updatedCommentVotes);
    })
    .catch(next);
}

function deleteUserComment(req, res, next) {

  const commentId = req.params.comment_id;
  if (!mongoose.Types.ObjectId.isValid(commentId)) return next({ name: 'invalidId', value: commentId });

  Comments.findByIdAndRemove(commentId)
    .then(deletedComment => {

      let deleteErrorCheck = checkDeleteCommentError(deletedComment, 'northcoder', commentId);
      if (deleteErrorCheck !== undefined) return next(deleteErrorCheck);

      res.status(202).json({ message: `comment with the id ${commentId} has been deleted` }); // No content - successfully processed but no return content
    })
    .catch(next);

}

module.exports = { changeCommentVote, deleteUserComment };
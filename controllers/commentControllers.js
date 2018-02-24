const Comments = require('../models/comments');

function changeCommentVote(req, res, next) {
  console.log('changeCommentVote called')

  const commentId = req.params.comment_id
  let modifier;

  if (req.query.vote === 'up') modifier = 1;
  else if (req.query.vote === 'down') modifier = -1;
  // else // create an error to pass to error handling middleware once written

  return Comments.findByIdAndUpdate(commentId, { $inc: { votes: modifier } }, { new: true })
    .then(updatedCommentVotes => {
      res.status(200).json(updatedCommentVotes) // better status code?
    })
    .catch(next)
}

function deleteUserComment(req, res, next) {
  console.log('deleteUserComment called')

  const commentId = req.params.comment_id;
  Comments.findById(commentId).lean()
    .then(comment => {
      if (comment.created_by === 'northcoder') {
        Comments.findByIdAndRemove(commentId)
          .then(deletedComment => {
            res.status(204) // No content - successfully processed but no return content
          })
          .catch(next)
      }
      else console.log('other author') // create an invalid user to delete comment
    })

}

module.exports = { changeCommentVote, deleteUserComment }
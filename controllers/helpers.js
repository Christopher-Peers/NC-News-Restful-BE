const mongoose = require('mongoose');

checkIdError = (id, mongoSearch) => {
  
  if (!mongoose.Types.ObjectId.isValid(id)) return { name: 'invalidId', value: id };
  if (mongoSearch === null || mongoSearch.length === 0) return { name: 'castError', value: id }
}

checkVotesError = (voteQuery) => {

  if (Object.keys(voteQuery)[0] !== 'vote') return { name: 'invalidQuery', value: Object.keys(voteQuery)[0] };
  if (voteQuery.vote !== 'up' && voteQuery.vote !== 'down') return { name: 'invalidDirection', value: voteQuery.vote };
}

checkPostCommentError = (newComment) => {
  
  if (newComment.body === undefined || newComment.body.length === 0) return { name: 'invalidComment', value: null };
}

checkDeleteCommentError = (dbComment, user, id) => {

  if (dbComment === null) return { name: 'noComment', value: id };
  if (dbComment.created_by !== user) return { name: 'invalidUser', value: user };
}

module.exports = { checkVotesError, checkPostCommentError, checkDeleteCommentError, checkIdError }
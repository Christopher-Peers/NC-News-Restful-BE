const express = require ('express');
const router = express.Router();
const { changeCommentVote, deleteUserComment } = require('../controllers/');

router.route('/:comment_id')
    .put(changeCommentVote)
    .delete(deleteUserComment)


module.exports = router;
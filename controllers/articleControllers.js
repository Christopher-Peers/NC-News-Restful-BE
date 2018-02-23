function getAllArticles (req, res, next) {
    console.log('getAllArticles called')
}

function getArticleComments (req, res, next) {
    console.log('getArticleComments called')
}

function postNewArticleComment (req, res, next) {
    console.log('postNewArticleComment called')
}

function changeArticleVote (req, res, next) {
    console.log('changeArticleVote called')
}

module.exports = { getAllArticles, getArticleComments, postNewArticleComment, changeArticleVote }
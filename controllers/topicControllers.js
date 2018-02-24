const Topics = require('../models/topics');

function getAllTopics (req, res, next) {
    console.log('getAllTopics called')

    return Topics.find().lean()
        .then(allTopics => {
            res.status(200).json({topics : allTopics});
        })
        .catch(next)

}

function getArticlesByTopic (req, res, next) {
    console.log('getArticlesByTopic called')
}

module.exports = { getAllTopics, getArticlesByTopic }
const Articles = require('../models/articles');
const Topics = require('../models/topics');

function getAllTopics(req, res, next) {
  console.log('getAllTopics called')

  return Topics.find().lean()
    .then(allTopics => {
      res.status(200).json({ topics: allTopics });
    })
    .catch(next)

}

function getArticlesByTopic(req, res, next) {
  console.log('getArticlesByTopic called')
  const topicToSearchFor = req.params.topic;

  return Articles.find({ belongs_to: topicToSearchFor }).lean()
    .then(articlesByTopic => {
      res.status(200).json({ articles: articlesByTopic})
    })
    .catch(next)
}

module.exports = { getAllTopics, getArticlesByTopic }
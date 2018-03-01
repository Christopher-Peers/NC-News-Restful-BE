const Articles = require('../models/articles');
const Topics = require('../models/topics');

function getAllTopics(req, res, next) {

  return Topics.find().lean()
    .then(allTopics => {
      res.status(200).json({ topics: allTopics });
    })
    .catch(next);

}

function getArticlesByTopic(req, res, next) {
  
  const topicToSearchFor = req.params.topic;

  return Articles.find({ belongs_to: topicToSearchFor }).lean()
    .then(articlesByTopic => {
      if (articlesByTopic.length < 1) return next({ name: 'invalidTopic', value: topicToSearchFor });
      
      res.status(200).json({ articles: articlesByTopic});
    })
    .catch(next);
}

module.exports = { getAllTopics, getArticlesByTopic };
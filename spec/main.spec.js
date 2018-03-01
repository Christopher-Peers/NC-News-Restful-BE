process.env.NODE_ENV = 'test';
const seed = require('../seed/test.seed');
const app = require('../server');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');

describe('northcoders news back end', () => {
  let docs = {};
  beforeEach(function () {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.dropDatabase()
        .then(() => {
          return seed();
        })
        .then(data => {
          docs = data;
          return docs;
        });
    }
    else {
      mongoose.connect(seed);
    }
  });
  after(() => {
    mongoose.disconnect();
  });

  describe('"GET" /api/topics', () => {
    it('returns an array of all topics in the database and a 200 status', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics.length).to.equal(3);
        });
    });
  });

  describe('"GET" /api/articles', () => {
    it('returns an array of all articles in the database and a 200 status.', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(2);
        });
    });
  });

  describe('"GET" /api/articles/:article_id', () => {
    it('returns a single article with the corresponding id and a 200 status.', () => {
      const article_id = docs.articles[0]._id.toString();
      return request
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(1);
          expect(res.body.articles[0].title).to.equal('Cats are great');
          expect(res.body.articles[0]._id).to.equal(article_id);
        });
    });
  });

  describe('"PUT" /api/articles/:article_id', () => {
    it('alters the vote up for corresponding :article_id paramameter and receives a 202 status.', () => {
      const article_id = docs.articles[0]._id.toString();
      return request
        .put(`/api/articles/${article_id}?vote=up`)
        .expect(202)
        .then(res => {
          expect(res.body.votes).to.equal(1);
        });
    });
    it('alters the vote down for corresponding :article_id paramameter and receives a 202 status.', () => {
      const article_id = docs.articles[0]._id.toString();
      return request
        .put(`/api/articles/${article_id}?vote=down`)
        .expect(202)
        .then(res => {
          expect(res.body.votes).to.equal(-1);
        });
    });
  });

  describe('"PUT" /api/comments/:comment_id', () => {
    it('alters the vote up for corresponding :comment_id paramameter and receives a 202 status.', () => {
      const comment_id = docs.comments[0]._id.toString();

      return request
        .put(`/api/comments/${comment_id}?vote=up`)
        .expect(202)
        .then(res => {
          expect(res.body.votes).to.equal(1);
        });
    });
    it('alters the vote down for corresponding :comment_id paramameter and receives a 202 status.', () => {
      const comment_id = docs.comments[0]._id.toString();
      return request
        .put(`/api/comments/${comment_id}?vote=down`)
        .expect(202)
        .then(res => {
          expect(res.body.votes).to.equal(-1);
        });
    });
  });

  describe('"DELETE" /api/comments/:comment_id', () => {
    it('deletes the comment corresponding to the :comment_id parameter if created by "northcoder".', () => {
      const comment_id = docs.comments[0]._id.toString();

      return request
        .delete(`/api/comments/${comment_id}`)
        .expect(202)
        .then(res => {
          expect(res.body.message).to.equal(`comment with the id ${comment_id} has been deleted`);
        });
    });
  });

  describe('"GET" /api/topics/:topic/articles', () => {
    it('returns an array of articles related to the :topic parameter and a 200 status.', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(1);
          expect(res.body.articles[0].belongs_to).to.equal('cats');
        });
    });
  });

  describe('"GET" /api/articles/:article_id/comments', () => {
    it('returns an array of comments related to the :article_id parameter and a 200 status.', () => {
      const article_id = docs.articles[0]._id.toString();
      return request
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.an('array');
          expect(res.body.comments.length).to.equal(3);
          expect(res.body.comments[0].body).to.equal('this is a comment');
          expect(res.body.comments[0].belongs_to).to.equal(article_id);
        });
    });
  });

  describe('"POST" /api/articles/:article_id/comments', () => {
    it('posts a comment for the specified :article_id parameter and gets a 201 status.', () => {
      const article_id = docs.articles[0]._id.toString();
      const testComment = { "comment": "test comment" };

      return request
        .post(`/api/articles/${article_id}/comments`)
        .send(testComment)
        .expect(201)
        .then(res => {
          expect(res.body.comment.body).to.equal(testComment.comment);
          expect(res.body.comment.belongs_to).to.equal(article_id);
          expect(res.body.comment.created_by).to.equal('northcoder');
        });
    });
  });

  describe('"GET" /api/users/:username', () => {
    it('returns the specified user corresponding to the :username paramater and gets a 200 status.', () => {

      return request
        .get('/api/users/northcoder')
        .expect(200)
        .then(res => {
          expect(res.body.users[0].username).to.equal('northcoder');
          expect(res.body.users.length).to.equal(1);
        });
    });
  });

});
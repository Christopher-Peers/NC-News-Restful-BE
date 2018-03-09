process.env.NODE_ENV = 'test';
const seed = require('../seed/test.seed');
const app = require('../server');
const { expect } = require('chai');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const DB_URI = require('../config').DB.test; 

describe('northcoders news error handling', () => {
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
      mongoose.connect(DB_URI, { useMongoClient: true });
    }
  });
  after(() => {
    mongoose.disconnect();
  });

  describe('invalid url checks', () => {
    describe('"GET" non existant url paths.', () => {
      it('returns a 404 for the path /bannana should start with /api', () => {
        return request
          .get('/bannana')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The path "/bannana" is not valid.');
          });
      });
      it('returns a 404 if the path beyond /api is not valid.', () => {
        return request
          .get('/api/bannana')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The path "/api/bannana" is not valid.');
          });
      });
    });
  });

  describe('all the ID checks', () => {
    describe('"GET" /api/articles/:article_id', () => {
      it('invalid mongo ID for :article_id parameter returns 400 status code', () => {
        return request
          .get('/api/articles/iLoveSoup')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The ID "iLoveSoup" is not a valid mongoose object ID');
          });
      });
      it('valid :article_id format, but that is not in the database returns a 404', () => {
        return request
          .get('/api/articles/4b3b9cdb22bfea24f4124c7a')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The ID "4b3b9cdb22bfea24f4124c7a" does not exist in the database.');
          });
      });
    });

    describe('"PUT" /api/articles/:article_id?vote=up', () => {
      it('invalid mongo ID for :article_id parameter returns 400 status code', () => {
        return request
          .put('/api/articles/w89hatsThis?vote=up')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The ID "w89hatsThis" is not a valid mongoose object ID');
          });
      });
      it('valid :article_id format, but that is not in the database returns a 404', () => {
        return request
          .put('/api/articles/4b3b9cdb22bfea24f4124c7a?vote=up')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The ID "4b3b9cdb22bfea24f4124c7a" does not exist in the database.');
          });
      });
    });

    describe('"POST" /api/articles/:articles_id/comments', () => {
      const testComment = { "comment": "test comment" };
      it('invalid mongo ID for :articles_id parameter returns 400 status code', () => {
        return request
          .post('/api/articles/iLoveSoup/comments')
          .send(testComment)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The ID "iLoveSoup" is not a valid mongoose object ID');
          });
      });
      it('valid :articles_id format, but that is not in the database returns a 404', () => {
        return request
          .post('/api/articles/4b3b9cdb22bfea24f4124c7a/comments')
          .send(testComment)
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The ID "4b3b9cdb22bfea24f4124c7a" does not exist in the database.');
          });
      });
    });

    describe('"GET" /api/articles/:article_id/comments', () => {
      it('invalid mongo ID for :article_id parameter returns 400 status code', () => {
        return request
          .get('/api/articles/w89hatsThis/comments')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The ID "w89hatsThis" is not a valid mongoose object ID');
          });
      });
      it('valid :article_id format, but that is not in the database returns a 404', () => {
        return request
          .get('/api/articles/4b3b9cdb22bfea24f4124c7a/comments')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The ID "4b3b9cdb22bfea24f4124c7a" does not exist in the database.');
          });
      });
    });

    describe('"PUT" /api/comments/:comment_id?vote=up', () => {
      it('invalid mongo ID for :comment_id parameter returns 400 status code', () => {
        return request
          .put('/api/comments/whoIsBob?vote=up')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The ID "whoIsBob" is not a valid mongoose object ID');
          });
      });
      it('valid :comment_id format, but that is not in the database returns a 404', () => {
        return request
          .put('/api/comments/4b3b9cdb22bfea24f4124c7a?vote=up')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The ID "4b3b9cdb22bfea24f4124c7a" does not exist in the database.');
          });
      });
    });

    describe('"DELETE" /api/comments/:comment_id', () => {
      it('invalid mongo ID for :comment_id parameter returns 400 status code', () => {
        return request
          .delete('/api/comments/whereDidTheOctopusGo')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The ID "whereDidTheOctopusGo" is not a valid mongoose object ID');
          });
      });
    });
  });

  describe('votes error checking', () => {
    describe('"PUT" /api/articles/:article_id?vote=up', () => {
      it('if the query is not spelt "vote" return 400 status and error message.', () => {
        const article_id = docs.articles[0]._id.toString();
        return request
          .put(`/api/articles/${article_id}?boat=up`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The query string "boat" is not valid please use the keyword "vote".');
          });
      });
      it('if vote query does not equal "up" or "down" return status 400 and error message', () => {
        const article_id = docs.articles[0]._id.toString();
        return request
          .put(`/api/articles/${article_id}?vote=blue`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The query "blue" is invalid. Only "?vote=up" or "?vote=down" are acceptable.');
          });
      });
    });
  });

  describe('post comments error checks', () => {
    describe('"POST" /api/articles/:articles_id/comments', () => {
      it('empty comment body returns a 400 status and an error message.', () => {
        const testComment = { "comment": "" };
        const article_id = docs.articles[0]._id.toString();
        return request
          .post(`/api/articles/${article_id}/comments`)
          .send(testComment)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The attempted comment posting\'s body was either not passed or an empty string.');
          });
      });
      it('incorrect key value on the body will return a 400 status and an error message', () => {
        const testComment = { "somestuff": "i have an invalid key value" };
        const article_id = docs.articles[0]._id.toString();
        return request
          .post(`/api/articles/${article_id}/comments`)
          .send(testComment)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The attempted comment posting\'s body was either not passed or an empty string.');
          });
      });
    });
  });

  describe('delete comments error checks', () => {
    describe('"DELETE" /api/comments/:comment_id', () => {
      it('if user tries to delete a comment not posted by them return 400 status and an error message.', () => {
        const comment_id = docs.comments[2]._id;
        return request
          .delete(`/api/comments/${comment_id}`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('The user "northcoder" may not delete a comment not created by them.');
          });
      });
      it('if the user tries to delete a :comment_id that does not exist return a 400 and an error message.', () => {
        return request
          .delete('/api/comments/4b3b9cdb22bfea24f4124c7a')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('The comment ID "4b3b9cdb22bfea24f4124c7a" does not exist in the database. Unable to delete.');
          });
      });
    });
  });

});
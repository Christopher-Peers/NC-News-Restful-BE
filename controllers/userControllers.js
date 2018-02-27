const Users = require('../models/users');

function getAllUsers(req, res, next) {

  return Users.find().lean()
    .then(allUsers => {
      res.status(200).json({ users: allUsers });
    })
    .catch(next);
}

function getUser(req, res, next) {

  const userHandle = req.params.username;
  return Users.findOne({username: userHandle}).lean()
    .then(singleUser => {
      res.status(200).json({users: singleUser});
    })
    .catch(next);

}

function getUserRepo(req, res, next) {
  console.log('getUserRepo called');
}

module.exports = { getAllUsers, getUserRepo, getUser };
const express = require ('express');
const router = express.Router();
const { getAllusers, getUserRepo } = require('../controllers/');

router.get('/', getAllusers);
router.get(':username/repos', getUserRepo)

module.exports = router;


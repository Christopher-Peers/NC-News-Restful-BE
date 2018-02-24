const express = require ('express');
const router = express.Router();
const { getAllUsers, getUserRepo, getUser } = require('../controllers/userControllers');

router.get('/', getAllUsers);
router.get('/:username', getUser);
router.get('/:username/repos', getUserRepo);

module.exports = router;
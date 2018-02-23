function getAllUsers (req, res, next) {
    console.log('getAllusers called')
}

function getUserRepo (req, res, next) {
    console.log('getUserRepo called')
}


function getUser (req, res, next) {
    console.log('getUser called')
}

module.exports = { getAllUsers, getUserRepo, getUser }
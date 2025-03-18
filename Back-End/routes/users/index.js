const express = require("express");
const { getUsers, addUsers, updateUsers, getUser, deleteUsers } = require("../../controllers/users");
const router = express.Router();
const passport = require('../../utils/passport-jwt');
const protect = passport.authenticate('jwt', { session: false });

router.get('/users',protect,getUsers);
router.get('/user/:uuid',protect, getUser);
router.post('/add-user', addUsers);
router.put('/update-user/:uuid',protect, updateUsers);
router.delete('/delete-user/:uuid',protect, deleteUsers);

module.exports = router 
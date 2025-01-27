// const express = require('express');
// const { loginUser, registerUser, logoutUser, updateUser } = require('../controllers/authController');
// const { isLoggedIn } = require('../middlewares/isLoggedIn');
// const router = express.Router();


// router.post('/register', registerUser)
// router.post('/login', loginUser)
// // router.get('/logout', logoutUser)


// // router.post('/update', isLoggedIn, updateUser);
// module.exports = router;
const express = require('express');
const { register, login} = require('../controllers/userController');
const { isLoggedIn} = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
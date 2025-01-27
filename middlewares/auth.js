const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


// module.exports.isLoggedIn = async (req, res, next) => {
//     if(!req.cookies.token){
//         return res.status(401).json({
//             status: 'error',
//             message: 'Please login to access this page'
//         });
//     }

//     try {
//         const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
//         // console.log(decoded);
//         let user = await userModel.findOne({email: decoded.email}).select('-password');
//         req.user = user;
//         console.log(req.user);
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             status: 'error',
//             message: 'Token expired, please login again'
//         });
//     }

// }
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
module.exports = authMiddleware;
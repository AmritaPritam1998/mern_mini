const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    try {
        let {email, name,mobile, password} = req.body;
        console.log(req.body)
    if (!email || !name || !password || !mobile) {
        return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
    }

    const userExists = await userModel.findOne({email})
    if (userExists) {
        return res.status(400).json({
            status: 'error',
            message: 'User already exists, please login'});
    }
    bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'An error occurred while hashing password'
                });
            }else {
                const user = await userModel.create({
                    email,
                    name,
                    password: hash,
                    mobile
                });

                const token = generateToken(user);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true, // Required for HTTPS
                    sameSite: 'none', // Required for cross-origin requests
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
                });
                res.status(201).json({
                    status: 'success',
                    user,
                    token,
                    message: 'User created successfully'
                });
            }
        })
    })
    
    } catch (error) {
        console.log(error)
        res.status(404).json({
            status: 'error',
            message: error.message
        });
    }
}

module.exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // console.log(req.body)

        if (!email || !password) {
            throw new Error('All fields are required');
        }
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });

        }
        bcrypt.compare(password,user.password, async(err,result)=>{
            
            if(result){
                const token = generateToken(user);
                res.cookie('token', token);
                res.json({
                    user,
                    message: 'User logged in successfully',
                    token
                });
            } else {
                return res.status(401).json({message: 'Email or password incorrect'});
            }
        })

    } catch (error) {
        console.log(error.message)
        res.status(400).json({error: error.message});
    }
}
// module.exports.logout = async (req, res) => {
//     try {
//         res.cookie('token', '');
//         return res.json({
//             status: 'success',
//             message: 'User logged out successfully'
//         });
//     } catch (error) {
//         return res.redirect('/');
//     }
// }

// module.exports.updateUser = async (req, res) => {
//     try {
        
//         const userId = req.user._id;
//         const { name, email, oldPassword, newPassword } = req.body;
//         const userdata = await userModel.findOne({ _id: userId });
        
//         if (userdata) {
//             const updatedata = {};
//             if (name) updatedata.name = name;
//             if (email.length > 0) {
//                 if (await userModel.findOne({ email: email })) {
//                     return res.status(409).json({ 
//                         status: "error", 
//                         message: "Email already exists."
//                     });
//                 }
//                 updatedata.email = email
//             }

//             if (newPassword.length> 0) {
//                 if (!await bcrypt.compare(oldPassword, userdata.password)) {
//                     return res.status(409).json({
//                         status: "error",
//                         message: "Your old password seems to be incorrect."
//                     })
//                 }
//                 if (await bcrypt.compare(oldPassword, userdata.password) == await bcrypt.compare(newPassword, userdata.password)) {
//                     return res.status(409).json({
//                         status: "error",
//                         message: "New password can not be same as old password."
//                     })
//                 }
//                 updatedata.password = await bcrypt.hash(newPassword, 10);
//             }
//             console.log("update",updatedata)
//             if (Object.keys(updatedata).length === 0) {
//                 res.status(200).json({ 
//                     status: "success", 
//                     message: "You have not set anything to updated." });
//             }

//             await userModel.findByIdAndUpdate(userId, updatedata);
//             res.status(200).json({ status: "success", message: "Profile updated successfully." });
//         } else {
//             return res.status(404).json({ status: "error", message: "User not found." });
//         }
//     } catch (err) {
//         if (err.code === 409) {
//             res.status(409).json({ status: "error", message: err.message });
//         } else {
//             res.status(500).json({ status: "error", message: "Internal server error." });
//         }   
//     }
// }
//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- import router and database models
const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const UserSchema = mongoose.model("UserSchema");
const axios = require('axios').default;

require("dotenv/config");

// *** --- signup request ---
router.post("/signup", async function (req, res, next) {z
    const { name, email, password } = req.body;

    // check request fields
    if (!name || !email || !password) {
        return res.status(400).json({
            msg: "can't be blank",
        });
    }

    // retrieve user information by user email
    const user = await UserSchema.findOne({
        email: email,
    });

    // register new user if user is not existing
    if (user) {
        return res.status(403).json({
            msg: "user is already exisiting",
        });
    } else {
        let newbie = new UserSchema({ name: name, email: email });
        newbie.setPassword(password);
        await newbie.save().then(function () {
            return res.status(200).json({
                msg: "new user added",
            })
        }).catch(function (err) {
            return res.status(400).json({
                msg: 'validation error - try another information',
            });
        });
    }
});

// *** --- login request ---
router.post('/login', async function (req, res, next) {
    const { email, password } = req.body;

    // check request fields
    if (!email || !password) {
        return res.status(400).json({
            msg: "can't be blank",
        });
    }

    // retrieve user information by user email
    const user = await UserSchema.findOne({
        email: email,
    });

    // try login request
    if (!user) {
        return res.status(404).json({
            msg: 'user is not registered',
        });
    } else {
        passport.authenticate(
            'local',
            {
                session: false,
            },
            function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    user.token = user.generateJWT();

                    return res.json({
                        user: user.toAuthJSON(),
                    });
                } else {
                    return res.status(401).json({
                        msg: 'invalid credential',
                    });
                }
            }
        )(req, res, next);
    }
});

// *** --- forget password request ---
router.post('/forgetpassword', async function (req, res, next) {
    // check if user is existing
    const user = await UserSchema.findOne({
        email: req.body.email,
    }).catch(next);
    if (user) {
        // set token expire
        const today = new Date();
        const exp = new Date(today);
        exp.setMinutes(today.getMinutes() + 300);

        // generate 4 digits and sign jwt
        const randomMsg = Math.floor(1000 + Math.random() * 9000);
        const token = jwt.sign(
            {
                msg: randomMsg,
                email: user.email,
                exp: parseInt(exp.getTime() / 1000),
            },
            process.env.SECRET
        );

        // send support email to user by delivery service
        axios.post(process.env.SMTP_URL, {
            authuser: process.env.SMTP_USER,
            authpass: process.env.SMTP_PASSWORD,
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Unreal Kingdom Support',
            content: randomMsg
        }).then((response) => {
            return res.status(200).json({
                msg: "Verification email sent",
                token: token
            });
        }).catch(function (err) {
            return res.status(400).json({
                msg: 'validation error - try another information',
            });
        });
    } else {
        return res.status(404).json({
            msg: 'user is not registered',
        });
    }
});

// *** --- verify forget password request ---
router.post('/verifyforget', async function (req, res) {
    const { token, digits, newPassword } = req.body;
    // check if request body is valid
    if (!token || !digits || !newPassword) {
        return res.status(400).json({
            msg: "validation error - try another information",
        });
    } else {
        try {
            // decode 4-digits and request email from token
            const { msg, email } = jwt.verify(token, process.env.SECRET);
            // if decoded 4-digits are same from backend request
            if (digits == msg) {
                // check if email from request body is existing
                const user = await UserSchema.findOne({
                    email: email,
                });
                // find if user is available in the database
                if (user) {
                    user.setPassword(newPassword);
                    user.save()
                        .then(function () {
                            return res.status(200).json({
                                msg: 'successfully reset password',
                            });
                        })
                        .catch(function (err) {
                            return res.status(400).json({
                                msg: 'validation error - try another information',
                            });
                        });
                } else {
                    return res.status(404).json({
                        msg: 'user is not registered',
                    });
                }
            } else {
                // when 4-digits are wrong
                return res.status(401).json({
                    msg: 'wrong digits code',
                });
            }
        } catch (err) {
            // when token is invalid
            return res.status(401).json({
                msg: 'wrong token information',
            });
        }
    }
});

// *** --- export user router ---
module.exports = router;

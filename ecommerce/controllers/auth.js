const User = require("../models/user");
const jwt = require("jsonwebtoken"); // generate signed token
const expressJwt = require("express-jwt"); // authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");
const nodemailer = require("nodemailer");

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;

        // transporter
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'julluna96@gmail.com', // generated ethereal user
                pass: 'bemivmoggbzzfgxf', // generated ethereal password
            },

        });


        // Definimos el email
        var mailOptions = {
            from: '"Nuevo Usuario" <julluna96@gmail.com>',
            to: user.email,
            subject: 'Usuario creado con exito',
            /*text: ' Nuevo Usuario ',*/
            html: '<b>Thanks for joining us! MERN ecommerce ❤️ </b> <img src="cid:1@nodemailer.com"/>',
            attachments: [
                {
                    filename: 'logo1.PNG',
                    path: 'public/logo1.png',
                    cid: '1@nodemailer.com',
                },
            ],
        };

        // send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.send(500, err.message);
            } else {
                console.log("Email sent");
                res.status(200).jsonp(req.body);
            }
        });

        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
        }

        // authenticate method 
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};

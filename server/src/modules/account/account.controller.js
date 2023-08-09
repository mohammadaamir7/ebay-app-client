const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const User = require("../../models/User");
const PasswordReset = require("../../models/PasswordReset");

const signUp = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, roleId } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            roleId,
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password' });
        }

        const payload = {
            user: {
                email: user.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const resetPasswordEmail = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded.user;

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);

        const user = await User.findOne({ email });

        await PasswordReset.updateMany(
            { userId: user._id, expiryDate: { $gt: new Date() } },
            { expiryDate: new Date() }
        );

        const passwordReset = new PasswordReset({
            userId: user._id,
            resetCode: code,
            expiryDate,
        });

        await passwordReset.save();

        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: '"Admin-Panel" jeedaddy@outlook.com',
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${code}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Reset code sent to email.' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const authorizePasswordReset = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded.user;

        const { resetCode: inputCode } = req.body;

        const user = await User.findOne({ email });

        const passwordReset = await PasswordReset.findOne({
            userId: user._id,
            resetCode: inputCode,
            expiryDate: { $gt: new Date() },
        });

        if (!passwordReset) {
            return res.status(400).json({ authorized: false, message: "Invalid or expired reset code." });
        }

        res.status(200).json({ authorized: true, message: "valid reset code." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const validateToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed authorization header.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({ message: 'Token is valid.' });
    } catch (error) {
        console.error('Error validating token: ', error);
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = { signUp, signIn, resetPasswordEmail, authorizePasswordReset, validateToken };
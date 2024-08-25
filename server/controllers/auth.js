const User = require("../models/user");
const Chat = require("../models/chat");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).send("มีผู้ใช้งานในระบบแล้ว");
        }

        const salt = await bcrypt.genSalt(10);

        user = new User({
            firstName,
            lastName,
            email,
            password,
            role,
        });

        user.password = await bcrypt.hash(password, salt);

        // Generate a verification token
        const token = jwt.sign(
            { userId: user._id },
            'jwtsecret', // Should be stored in environment variables
            { expiresIn: '1d' }
        );

        user.verificationToken = token;
        user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiry

        await user.save();

        // Send verification email
        await sendVerificationEmail(user);

        res.status(200).send("สมัครสมาชิกสำเร็จแล้ว, กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชีของคุณ");
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

// Function to send verification email
const sendVerificationEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const verificationUrl = `${process.env.BASE_URL}/api/verify-email/${user.verificationToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verify Your Email',
        html: `
            <html>
                <body>
                    <h2>Verify Your Email Address</h2>
                    <p>Please verify your email by clicking the link below:</p>
                    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
                </body>
            </html>
        `
    };

    await transporter.sendMail(mailOptions);
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            _id: decoded.userId,
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send("Invalid or expired token");
        }

        user.isVerified = true;
        user.verificationToken = undefined; // Clear the verification token
        user.verificationTokenExpiry = undefined; // Clear the token expiry

        await user.save();

        // HTML response with a button to redirect to the login page
        const responseHtml = `
            <html>
                <body>
                    <h2>อีเมลของคุณได้รับการยืนยันแล้ว</h2>
                    <p>คุณสามารถเข้าสู่ระบบได้โดยคลิกปุ่มด้านล่าง:</p>
                    <a href="${process.env.LOGIN_URL}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">เข้าสู่ระบบ</a>
                </body>
            </html>
        `;

        res.status(200).send(responseHtml);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

exports.loginUser = async (req, res) => {
    try {
        // Check User
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("อีเมลไม่ถูกต้อง");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("รหัสผ่านไม่ถูกต้อง");
        }

        if (!user.statusBlacklist) {
            return res.status(400).send("บัญชีนี้ถูกระงับการใช้งาน");
        }

        if (!user.isVerified) {
            return res.status(400).send("บัญชีนี้ยังไม่ได้รับการยืนยัน");
        }

        // Payload
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                statusBlacklist: user.statusBlacklist
            }
        };

        // Generate token
        jwt.sign(payload, 'jwtsecret', { expiresIn: "1d" }, (error, token) => {
            if (error) throw error;
            res.json({ token, payload });
        });

        // Find or create chat
        const firstId = user._id.toString();
        const secondId = "66cb36ab9921d568721221b9";

        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] },
        });

        if (!chat) {
            const newChat = new Chat({
                members: [firstId, secondId]
            });

            await newChat.save();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

exports.currenUser = async (req, res) => {
    try {
        //console.log('currenUser', req.user)
        const user = await User.findOne({ email: req.user.email })
            .select('-password -idCard')
            .exec()
        res.status(200).send(user)

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

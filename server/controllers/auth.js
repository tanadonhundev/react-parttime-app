const User = require("../models/user");
const Chat = require("../models/chat");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        //CheckUser
        const { firstName, lastName, email, password, role } = req.body;

        var user = await User.findOne({ email });

        if (user) {
            return res.status(400).send("มีผู้ใช้งานในระบบแล้ว");
        }

        //Encrypt
        const salt = await bcrypt.genSalt(10);

        user = new User({
            firstName,
            lastName,
            email,
            password,
            role,
        });

        user.password = await bcrypt.hash(password, salt);
        //Save in Database
        await user.save();
        res.status(200).send("สมัครสมาชิกสำเร็จแล้ว");
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
        throw error;
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
        const secondId = "6577285fb8f33d4385fff395";

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

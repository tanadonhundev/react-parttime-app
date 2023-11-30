const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        //CheckUser
        const { firstName, lastName, email, password, role } = req.body;

        var user = await User.findOne({ email });

        if (user) {
            return res.status(200).send("มีผู้ใช้งานในระบบแล้ว");
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
        //Check User
        const { email, password } = req.body
        var user = await User.findOneAndUpdate({ email }, { new: true })

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(200).send("รหัสผ่านไม่ถูกต้อง");
            } else {
                //Payload
                var payload = {
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                    }
                }
                //Generate token
                jwt.sign(payload, 'jwtsecret', { expiresIn: "1d" }, (error, token) => {
                    if (error) throw error;
                    res.json({ token, payload })
                });
            }
        } else return res.status(200).send("อีเมลไม่ถูกต้อง");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    };
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

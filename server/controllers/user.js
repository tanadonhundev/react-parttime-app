const User = require("../models/user");

exports.userList = async (req, res) => {
    try {
        const user = await User.find({}).exec();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.statusBlacklistUser = async (req, res) => {
    try {
        //console.log(req.body)
        await User.findOneAndUpdate({ _id: req.body.id }, { statusBlacklist: req.body.statusBlacklist });
        res.send("อัทเดทสถานนะสำเร็จ")
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.statusVerify = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.params.id }, { statusVerify: req.body.status });
        res.send("อัทเดทสถานนะสำเร็จ")
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.removeUser = async (req, res) => {
    try {
        //console.log(req.body)
        const id = req.params.id;
        await User.findOneAndDelete({ _id: id });
        res.send("ลบผู้ใช้งานสำเร็จ");
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.profileUser = async (req, res) => {
    try {
        //console.log(req.params.id)
        const id = req.params.id;
        const user = await User.findOne({ _id: id });
        res.send(user)
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}

exports.profileEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        // Check if 'avatarphoto' and 'idcard' files were uploaded
        if (req.files) {
            if (req.files['avatarphoto']) {
                data.avatarphoto = req.files['avatarphoto'][0].filename;
            }
            if (req.files['idcardphoto']) {
                data.idcardphoto = req.files['idcardphoto'][0].filename;
            }
            if (req.files['companyphoto']) {
                data.companyphoto = req.files['companyphoto'][0].filename;
            }
        }

        const updated = await User
            .findOneAndUpdate({ _id: id }, data, { new: true })
            .exec();

        res.send({ data: updated, message: "แก้ไขโปรไฟล์ผู้ใช้งานสำเร็จ" });
    } catch (error) {
        console.log(error);
        res.send('Server Error');
    }
}
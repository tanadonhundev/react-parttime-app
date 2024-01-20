const User = require("../models/user");

exports.userList = async (req, res) => {
    try {
        const user = await User.find({}).exec();
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.statusBlacklistUser = async (req, res) => {
    try {
        //console.log(req.body)
        await User.findOneAndUpdate({ _id: req.body.id }, { statusBlacklist: req.body.statusBlacklist });
        res.status(200).send("อัทเดทสถานนะสำเร็จ")
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.statusVerify = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.params.id }, { statusVerify: req.body.status });
        res.status(200).send("อัทเดทสถานนะสำเร็จ")
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.removeUser = async (req, res) => {
    try {
        //console.log(req.body)
        const id = req.params.id;
        await User.findOneAndDelete({ _id: id });
        res.status(200).send("ลบผู้ใช้งานสำเร็จ");
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.profileUser = async (req, res) => {
    try {
        //console.log(req.params.id)
        const id = req.params.id;
        const user = await User.findOne({ _id: id }).select('-password');
        res.status(200).send(user)
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

exports.loadPhoto = async (req, res) => {
    try {
        const companyId = req.params.id;
        const user = await User.findOne({ _id: companyId });
        res.status(200).send(user)
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

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
        //data.statusVerify = 'รอตรวจสอบ';
        const updated = await User
            .findOneAndUpdate({ _id: id }, data, { new: true })
            .exec();

        res.status(200).send({ data: updated, message: "แก้ไขโปรไฟล์ผู้ใช้งานสำเร็จ" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}
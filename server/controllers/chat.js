const Chat = require("../models/chat");

exports.createChat = async (req, res) => {
    try {
        const { firstId, secondId } = req.body

        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] },
        });
        if (chat) return res.status(200).send(chat);

        const newChat = new Chat({
            members: [firstId, secondId]
        })

        const response = await newChat.save();

        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};

exports.findUserChats = async (req, res) => {
    try {
        const userId = req.params.userId;

        const chats = await Chat.find({
            members: { $in: [userId] },
        });

        res.status(200).send(chats);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};

exports.findChat = async (req, res) => {
    try {
        const { firstId, secondId } = req.params;

        const chat = await Chat.find({
            members: { $all: [firstId, secondId] },
        });

        res.status(200).send(chat);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};


const UnreadMessage = require("../models/unreadMessage");

exports.unreadMessage = async (req, res) => {
    const { chatId, userId, count } = req.body;

    try {
        await UnreadMessage.findOneAndUpdate(
            { chatId, userId },
            { count },
            { upsert: true, new: true }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.FindUnreadMessage = async (req, res) => {
    const { userId } = req.params;

    try {
        const unreadMessages = await UnreadMessage.find({ userId });
        res.status(200).json(unreadMessages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

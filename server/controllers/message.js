const Message = require("../models/message");


exports.createMessage = async (req, res) => {
    try {
        const { chatId, senderId, text } = req.body

        const message = new Message({
            chatId, senderId, text
        })

        const response = await message.save();

        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};

exports.getMessage = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await Message.find({ chatId })
        
        res.status(200).send(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
        throw error;
    }
};
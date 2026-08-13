import Contact from '../models/Contact.js'

export const submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = await Contact.create({ name, email, subject, message });
        res.status(201).json({ message: "Your message has been sent", contact });
    } catch (error) {
        console.error("Error on submit contact message", error);
        res.status(500).json({ message: "something went wrong " }, error.message);
    }
};

export const getAllMessage = async (req, res) => {
    try {
        const { read } = req.query;
        const filter = {};

        if (read === 'false') filter.isRead = false;
        if (read === 'true') filter.isRead = true;

        const messages = await Contact.find(filter).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error("Error on getAllMessages: ", error);
    }
    res.status(500).json({ message: "Something went wront to get all messages" });
};

export const getMessageById = async (req, res) => {
    try {

        const message = await Contact.findById(req.parms.id);

        if (!message) return res.status(404).json({ message: "Message not found" });

        if (!message.isRead) {
            message.isRead = true;
            await message.save();
        }

        res.json(message);
    } catch (error) {
        console.error("Error to get message by id: ", error);
        res.status(500).json({ message: "Something went wrong to get message by id" }, error.message);
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findByIdAndDelete(req.parms.id);

        if(!message) return res.status(404).json({message: "Message not found"});

        res.json({message : "Message deleted. "});
    } catch (error) {
        console.error("Error to delete: ", error);
        res.status(500).json({ message: "Something went to delete message" }, error.message);
    }
};


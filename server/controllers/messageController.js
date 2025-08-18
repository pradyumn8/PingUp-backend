import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Message from '../models/Message.js';

// Create an empty object to store  ss Event Connections
const connections = {};

// Controller function for the SSE endpoint
export const sseController = async (req, res) => {
    const { userId } = req.params
    console.log('New client connected:', userId);

    // set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');


    // Add the client's reponse object to the connections object
    connections[userId] = res;

    // send an initial message to the client
    res.write('log: Connected to SSE stream\n\n');

    // Handle client disconnection
    req.on('close', () => {
        // Remove the client's response from the connections array
        delete connections[userId]; // remove the client from connections
        console.log('Client disconnected:', userId);
    });
}

// Send Message
export const sendMessage = async (message) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if (message_type === 'image') {
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
            });
            media_url = response.url({
                path: response.filePath;
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
        }
        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text: req.body.text,
            message_type,
            media_url,
        })
        res.json({ success: true, message })

        // Send the message to to_user_id using SSE

        const messageWithUserData = await Message.findById(message._id)
            .populate('from_user_id');

        if (connections[to_user_id]) {
            connections[to_user_id]
                .write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// Get Chat Messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: -1 })
        // Mark messges as seen
        await Message.updateMany(
            { from_user_id: to_user_id, to_user_id: userId, seen: false },
            { $set: { seen: true } }
        );

        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const messages = await Message.find({ to_user_id: userId }
            .populate('from_user_id to_user_id')).sort({ createdAt: -1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
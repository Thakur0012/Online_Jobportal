import Subscriber from '../models/Subscriber.js';

// =============================================
// AUTH: Subscribe to newsletter
// =============================================
export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user._id;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ user: userId, email });
        if (existing) {
            return res.status(400).json({ message: "You are already subscribed with this email" });
        }

        const newSubscriber = new Subscriber({
            user: userId,
            email
        });

        await newSubscriber.save();
        res.status(201).json({ message: "Successfully subscribed to the newsletter!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// ADMIN: Get all subscribers
// =============================================
export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// ADMIN: Remove a subscriber
// =============================================
export const removeSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        if (!subscriber) return res.status(404).json({ message: "Subscriber not found" });

        await subscriber.deleteOne();
        res.status(200).json({ message: "Subscriber removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

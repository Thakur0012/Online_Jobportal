import Notification from '../models/Notification.js';

// Get notifications for the logged-in user
export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        // Find individual notifications OR global notifications that target this user's role (or 'all')
        const notifications = await Notification.find({
            $or: [
                { recipient: userId },
                { isGlobal: true, targetRole: { $in: [userRole, 'all'] } }
            ]
        }).sort({ createdAt: -1 }).limit(30);

        // Map them to include an easy 'read' status for the client
        const mapped = notifications.map(n => {
            const isRead = n.isGlobal ? n.readBy.includes(userId) : n.isRead;
            return {
                ...n.toObject(),
                isRead
            };
        });

        res.status(200).json(mapped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a specific notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.isGlobal) {
            if (!notification.readBy.includes(req.user._id)) {
                notification.readBy.push(req.user._id);
            }
        } else {
            // Verify ownership
            if (notification.recipient.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            notification.isRead = true;
        }

        await notification.save();
        res.status(200).json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        // Find all unread global notifications available to this user
        const unreadGlobal = await Notification.find({
            isGlobal: true,
            targetRole: { $in: [userRole, 'all'] },
            readBy: { $ne: userId }
        });

        // Add user to readBy
        for (const n of unreadGlobal) {
            n.readBy.push(userId);
            await n.save();
        }

        // Mark all individual notifications as read
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

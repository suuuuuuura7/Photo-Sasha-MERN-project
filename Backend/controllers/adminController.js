import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Gallery from '../models/Gallery.js';
import Review from '../models/Review.js';
import Contact from '../models/Contact.js';
import Photographer from '../models/Photographer.js'

export const getStats = async (req, res) => {
    try {
        const [totalUsers, totalBookings, totalGallery, unreadMessages, pendingReviews, totalPhotographer] =
            await Promise.all([
                User.countDocuments(),
                Booking.countDocuments(),
                Gallery.countDocuments(),
                Contact.countDocuments({ isRead: false }),
                Review.countDocuments({ isApproved: false }),
                Photographer.countDocuments(),
            ]);

        const recentBookings = await Booking.find()
            .populate('user', 'name email')
            .populate('photographer', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalUsers,
            totalBookings,
            totalGallery,
            unreadMessages,
            pendingReviews,
            recentBookings,
        });
    } catch (error) {
        console.error("Error on Admin stats: ", error);
        res.status(500).json({ message: "Something wrong on user stats" }, error.message);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });//exclude the user password
        res.json(users);
    } catch (error) {
        console.error("Error on Admin side getAllUsers: ", error);
        res.status(500).json({ message: "Something wrong to get all users" }, error.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found. " });

        // Prevent admin from deleting their own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: "User deleted. " });
    } catch (error) {
        console.error("Error on Admin getAllUsers: ", error);
        res.status(500).json({ message: "Something wrong to deleteUser " }, error.message);
    }
};

export const updateUserRole = async (req, res) => {
    try {

        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. must be user or admin" });
        }
        //admin can't update there role
        if (req.params.id === req.user._id.toString() && role !== 'admin') {
            return res.status(400).json({ message: 'You cannot change your own role.' });
        }

        const user = await User.findByIdAndUpdate(req.params.id);

        if (!user) return res(404).json({ message: "User not found" });

        req.json({ message: `Role updated to ${role}` }, user);
    } catch (error) {
        console.error("Error on Admin getAllUsers: ", error);
        res.status(500).json({ message: "Something wrong to deleteUser " }, error.message);
    }
};
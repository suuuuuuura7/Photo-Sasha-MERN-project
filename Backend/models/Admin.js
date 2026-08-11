import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
            // e.g. 'DELETED_USER', 'APPROVED_REVIEW', 'UPDATED_BOOKING_STATUS'
        },
        targetModel: {
            type: String,
            enum: ['User', 'Booking', 'Gallery', 'Review', 'Contact'],
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        details: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
    }, { timestamps: true }

);


adminSchema.index({ admin: 1, createdAt: -1 });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
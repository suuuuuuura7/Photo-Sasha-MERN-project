import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import "dotenv/config";

const saltRound = 11;

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// httpOnly cookie session
const sendTokenCookie = (res, userId) => {
    const expiresDays = Number(process.env.JWT_EXPIRES_DAYS);

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: `${expiresDays}d`
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: expiresDays * 24 * 60 * 60 * 1000,
        path: "/",
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered please login" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRound);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            isVerified: false,
        });

        sendTokenCookie(res, user._id);

        return res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Registration error", error);
        res.status(500).json({ message: "Something went wrong creating your account. Please try again later" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (!existingUser) {
            return res.status(409).json({ message: "Email is not registered please create an account" });
        }
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or Password" });
        }

        // Check if user has password (might be Google-only account)
        if (!user.password) {
            return res.status(401).json({ message: "This account uses Google Sign-In. Please use Google to login." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        sendTokenCookie(res, user._id);

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "Something went wrong while signing in to your account" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Google authorization code is required" });
        }

        // 1. Exchange code for tokens
        const { tokens } = await googleClient.getToken({
            code,
            redirect_uri: 'postmessage',
        });

        // 2. Verify the ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture, email_verified } = payload;

        // 3. Check if user exists by email
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            // Link googleId if user registered with email/password previously
            if (!user.googleId) {
                user.googleId = googleId;
                user.isVerified = email_verified || true;
                await user.save();
            }
        } else {
            // 4. Create new user if they don't exist
            user = await User.create({
                name: name || email.split('@')[0],
                email: email.toLowerCase(),
                googleId,
                isVerified: email_verified || true,
                password: null, // No password for Google users
                phone: 'Not Provided', // Phone is required by schema
                role: 'user',
            });
        }

        // 5. Issue httpOnly cookie session token
        sendTokenCookie(res, user._id);

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("Google auth error:", error);
        return res.status(401).json({ message: "Google authentication failed. Please try again." });
    }
};

export const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({ message: "Failed to get user data" });
    }
};
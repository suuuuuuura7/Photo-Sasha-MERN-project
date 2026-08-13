import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import "dotenv/config";

const saltRound = 11;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered please login" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRound);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        sendTokenCookie(res, user._id);

        return res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Registration error", error);
        res.status(500).json({ message: "Something went wrong creating your account pls try again later" });
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
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        sendTokenCookie(res, user._id);

        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "Something went wrong while sign in your account" });
    }
};


export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential token is required" });
        }

        // 1. Verify token with Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, sub: googleId } = ticket.getPayload();

        // 2. Check if user exists by email
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            // Link googleId if user registered with email/password previously
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // 3. Create new user if they don't exist
            user = await User.create({
                name,
                email: email.toLowerCase(),
                googleId,
                isVerified: true, // Accounts verified by Google are pre-verified
            });
        }

        // 4. Issue httpOnly cookie session token
        sendTokenCookie(res, user._id);

        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Google auth error", error);
        return res.status(401).json({ message: "Google authentication failed" });
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
    const user = req.user;
    return res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            createdAt: user.createdAt,
        },
    });
};
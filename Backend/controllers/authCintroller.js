import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";



const saltRound = 11;

//httpOnly cookie session
const sendTokenCookie = (res, userId) => {
    const expiresDays = Number(process.env.JWT_EXPIRES_DAYS);

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: `${expiresDays}`
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: expiresDays * 24 * 60 * 60 * 1000,
        path: "/",
    });
}

export const register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: "Email is already register please login" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRound);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        sendTokenCookie(res, user._id);

        return res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Registration error", error);
        res.status(500).json({ message: "someting went wrong creating your account pls try again later" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (!existingUser) {
            return res.status(409).json({ message: "Email is not register please create an account" });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password",);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email" });
        };

        sendTokenCookie(res, user._id);

        return res.status(200).json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "Something went wrong while sign in your account" })
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
}

export const getMe = async (req, res) => {
    const user = req.user;
    return res.status(200).json({
        user: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
    });
};
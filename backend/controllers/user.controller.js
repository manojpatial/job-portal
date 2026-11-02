import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


//for register
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        };

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        res.status(201).json({
            message: "User registered successfully",
            success: true
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// for login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required",
                success: false
            });
        };
        let user = await User.findOne({ email, role });
        //user exists or not
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false
            });
        }
        //password is correct or not
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false
            });
        };
        // role is correct or not
        if (user.role !== role) {
            return res.status(400).json({
                message: "Invalid role",
                success: false
            });
        };
        //generate token
        const tokenData = {
            userId: user._id,
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });
        //set user data to send in response/cookie
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        res.status(200).cookie("token", token, {
            httpOnly: true,
            //secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day

        }).json({
            message: `Welcome back! ${user.fullname}`,
            user,
            success: true,
            token,
        });



    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }
}

//for logout
export const logout = async (req, res) => {
    try {
        return res.clearCookie("token").json({
            message: "User logged out successfully",
            success: true
        });

    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Server error" });
    }
}

//Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file; // Assuming you're using multer for file uploads

        //cloudinary
        let cloudResponse = null;

        console.log("1. Route reached");
        console.log("2. req.file:", file);

        if (file) {
            try {
                console.log("3. Creating Data URI...");
                const fileUri = getDataUri(file);
                console.log("4. Data URI created:", fileUri ? "Yes" : "No");

                console.log("5. Uploading to Cloudinary...");

                cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "auto",
                });

                console.log("6. Upload successful:", cloudResponse.secure_url);
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({
                    success: false,
                    error: err.message,
                });
            }
        }



        //skills array
        let skillsArray = [];

        if (skills) {
            skillsArray = skills.split(",").map(skill => skill.trim());
        }

        const userID = req.id; //from middleware
        let user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        //updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray.length > 0) user.profile.skills = skillsArray;

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        res.status(200).json({
            message: "User profile updated successfully",
            success: true,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
            }
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
}

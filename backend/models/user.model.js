import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "recruiter"],
        default: "student",
        required: true,
    },
    profile: {
        bio: {
            type: String,
            default: "",
          },
        skills: {
            type: [String],
            default: [],
            },
        resume: {
            type: String,
            default: "",
            },
        resumeOriginalName: {
            type: String,
            default: "",
        },
        company: {type:mongoose.Schema.Types.ObjectId, ref: "Company"},
        profilePhoto: {
            type: String,
            default: "",
        }
    },
  },{ timestamps: true }
);

export const User = mongoose.model('User', userSchema);
//export default User;  //if you do not want to use {} while import User model, then remove export from above line and uncomment this line
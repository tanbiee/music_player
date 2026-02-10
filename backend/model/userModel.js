import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is requires"],
        minLength: 6,
    },
    avatar: {
        type: String,
        default: '',

    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    favorites: [{
        id: {
            type: String,
            required: true,
        },
        name: String,
        artistName: String,
        Image: String,
        durarion: String,
        Audio: String,
    }]

})

//presave function for password
userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;
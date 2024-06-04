const mongoose = require('mongoose');
const { type } = require('os');
const { styleText } = require('util');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = 8;
const SECRET_KEY = "THISISMEPARDEEPCHOUDHARY";


const passwordRegex = /^(?=.*[A-Z])(?=.*\d)|(?=.*[!@#$%^&*(),.?":{}|<>])/;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: "Email address is required",
        lowercase: true,
        trim: true,
        validate: [isEmail, 'Please fill a valid email address']
    },
    mobile: {
        type: Number,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlenth: 6,
        validate: {
            validator: function (v) {
                return passwordRegex.test(v);
            },
            message: props => `${props.value} is not a valid password! It must be at least 6 characters long and contain at least one uppercase letter, one number, or one special character.`
        }
    },
    avatar: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    await bcrypt.compare(this.password, password);
}

userSchema.methods.genrateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            mobile: this.mobile,
        },
        SECRET_KEY,
        {
            expiresIn: '1d'
        }
    )

}

userSchema.methods.genrateRefresToken = async function (user) {
    return jwt.sign(
        {
            _id: this._id,
        },
        SECRET_KEY,
        {
            expiresIn: '10d'
        }
    )
}
const User = mongoose.model("User", userSchema);

module.exports = User;
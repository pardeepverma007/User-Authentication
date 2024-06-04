const { SuccessResponse, ErrorResponse } = require('../utils/response')
const User = require('../modal/user.modal');



const genRateToken = async (user_id) => {
    try {
        const user = await User.findById(user_id);
        const accessToken = await user.genrateAccessToken();
        const refreshToken = await user.genrateRefresToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }
    } catch (err) {
        res.status(500).send(new ErrorResponse(500, "SomeThing went Wrong while we generating Access and RefreshToken"))
    }
}


const userRegister = async (req, res) => {
    try {
        const { name, email, password, mobile, avatar } = req.body;
        console.log(name, email, password, mobile, avatar, "File")

        const avatarLocalpath = req.file.path
        console.log(avatarLocalpath);
        // if (!name && !email && !password && mobile) {
        //     res.status(400).send(new ErrorResponse(400, "All fields are reuired"));
        //     return;
        // }
        // const existedUser = await User.findOne({
        //     $or: [{ email: email, mobile: mobile }]
        // })
        // if (existedUser) {
        //     res.status(400).send(new ErrorResponse(400, "User with email or mobile no is already exists"));
        //     return;
        // }

        // const user = await User.create(req.body);
        // const userData = await User.findById(user._id).select("-password -refreshToken")

        // res.status(200).send(new SuccessResponse(userData, "Successful created new user", 200))
    } catch (err) {
        console.log(err)
        res.status(500).send(new ErrorResponse(500, err, "Server Error"));
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            res.status(400).send(new ErrorResponse(400, "Email and Password is Required"))
            return;
        }
        const user = await User.findOne({ email: email });
        console.log("isExist", user)
        if (!user) {
            res.status(400).send(new ErrorResponse(400, "User Not Found With This Email"))
            return;
        }
        const checkPassword = user.isPasswordCorrect(password)
        if (!checkPassword) {
            res.status(400).send(new ErrorResponse(400, "Incorrect Password"))
            return;
        }
        const { accessToken, refreshToken } = await genRateToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        const userData = await User.findById(user._id).select('-password -refreshToken')
        res.status(200)
            .cookie("accesstoken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .send(new SuccessResponse(userData, 200)
            )
    } catch (err) {
        console.log("Error from user Login", err);
        res.status(500).send(new ErrorResponse(500, "Server Error"));
        return;
    }
}

module.exports = { userRegister, userLogin }
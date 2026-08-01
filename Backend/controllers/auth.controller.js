import { User} from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';

const toClientUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, company } = req.body;

    if(!name || !email || !password)
        throw new ApiError(400, "Please provide name, email and password");

    const exists = await User.findOne({email: email.toLowerCase()});

    if(exists)
        throw new ApiError(400, "User already exists");

    const user = await User.create({
        name,
        email,
        password,
        company
    });

    res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: toClientUser(user),
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if(!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: toClientUser(user),
    });
});

export const getMe = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: toClientUser(req.user),
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { name, avatar, password, company } = req.body;

    const user = req.user;

    if(name !== undefined) user.name = name;
    if(avatar !== undefined) user.avatar = avatar;
    if(company !== undefined) user.company = company;
    if(password) user.password = password;


    await user.save();
    res.json({
        success: true,
        user: toClientUser(user),
    });
});
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (!user) {
        throw new Error('Invalid user data');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        };
    } else {
        throw new Error('Invalid credentials');
    }
};

const getProfile = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'role'] // Exclude password
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

const updateProfile = async (userId, newName) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    user.name = newName;
    await user.save();
    
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
};

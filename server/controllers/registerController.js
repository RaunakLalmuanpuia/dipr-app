import bcrypt from 'bcrypt';
import db from '../models/index.js';

const { User } = db;
export const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    try {
        // Check duplicate username
        const duplicate = await User.findOne({
            where: { username: user }
        });

        if (duplicate) return res.sendStatus(409); // Conflict

        // Hash password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Create user
        const result = await User.create({
            username: user,
            password: hashedPwd
            // roles will use default: { User: 2001 }
        });

        console.log(result.toJSON());

        res.status(201).json({
            success: `New user ${user} created!`
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

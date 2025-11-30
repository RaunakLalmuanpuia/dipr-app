import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User } = db;    // adjust path if needed

export const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({
            message: 'Username and password are required.'
        });
    }

    try {
        // Find user
        const foundUser = await User.findOne({
            where: { username: user }
        });

        if (!foundUser) return res.sendStatus(401); // Unauthorized

        // Compare password
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (!match) return res.sendStatus(401);

        const roles = Object.values(foundUser.roles).filter(Boolean);

        // Create JWT access token
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );

        // Create refresh token
        const newRefreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );



        let storedToken = foundUser.refreshToken;

        // If cookie exists (old refresh token)
        if (cookies?.jwt) {

            const oldToken = cookies.jwt;

            // Check if the RT exists in DB
            const foundToken = await User.findOne({
                where: { refreshToken: oldToken }
            });

            // Reuse detected (token does not match any user)
            if (!foundToken) {
                console.log("Attempted refresh token reuse at login!");
                storedToken = null; // clear stored token
            }

            // Clear cookie
            res.clearCookie("jwt", {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            });
        }

        // Save new refresh token
        foundUser.refreshToken = newRefreshToken;
        await foundUser.save();

        // Set refresh token cookie
        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });
        // Send auth data
        res.json({ roles, accessToken });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

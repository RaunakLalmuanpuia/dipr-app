import db from '../models/index.js';
const { User } = db;

export const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    // No cookie → No content
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    try {
        // Try to find user with this refresh token
        const foundUser = await User.findOne({
            where: { refreshToken }
        });

        // If no user found → still clear cookie, return 204
        if (!foundUser) {
            res.clearCookie("jwt", {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            });
            return res.sendStatus(204);
        }

        // Remove stored refresh token
        foundUser.refreshToken = null;
        await foundUser.save();

        // Clear cookie
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        return res.sendStatus(204);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

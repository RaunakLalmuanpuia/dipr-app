import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const { User } = db;  // adjust path as needed

export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    // Clear old cookie immediately
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

    try {
        // Find user with this refresh token
        const foundUser = await User.findOne({
            where: { refreshToken }
        });

        // -----------------------------------------------------
        // 🔴 Refresh Token Reuse Detected
        // -----------------------------------------------------
        if (!foundUser) {
            console.log("No user found for this refresh token → possible reuse!");

            // Check if token is valid and belongs to another user
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) return res.sendStatus(403); // Forbidden

                    console.log("Attempted refresh token reuse!");

                    const hackedUser = await User.findOne({
                        where: { username: decoded.username }
                    });

                    if (hackedUser) {
                        hackedUser.refreshToken = null; // clear stolen RT
                        await hackedUser.save();
                    }
                }
            );

            return res.sendStatus(403);
        }

        // -----------------------------------------------------
        // ✓ Valid user with this refresh token
        // -----------------------------------------------------

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {

                // Token expired → remove old token from DB
                if (err) {
                    console.log("Expired refresh token");

                    foundUser.refreshToken = null;
                    await foundUser.save();

                    return res.sendStatus(403);
                }

                if (decoded.username !== foundUser.username) {
                    return res.sendStatus(403);
                }

                // -----------------------------------------------------
                // ✓ Create new access token
                // -----------------------------------------------------
                const roles = Object.values(foundUser.roles);
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: foundUser.username,
                            roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "10s" }
                );

                // -----------------------------------------------------
                // ✓ Rotate new refresh token
                // -----------------------------------------------------
                const newRefreshToken = jwt.sign(
                    { username: foundUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: "1d" }
                );

                // Save new token in DB (replace old one)
                foundUser.refreshToken = newRefreshToken;
                await foundUser.save();

                // Send new refresh token cookie
                res.cookie("jwt", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 24 * 60 * 60 * 1000
                });

                // Send new access token + roles
                res.json({ roles, accessToken });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

import db from '../models/index.js';

const { User } = db;

export const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    if (!users || users.length === 0) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

export const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ where: { id: req.body.id } });
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
}

export const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}
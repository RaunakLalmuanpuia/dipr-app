import express from 'express';
import { getAllUsers, getUser, deleteUser } from '../../controllers/usersController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';
const router = express.Router();

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);



router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), getUser);

export default router;
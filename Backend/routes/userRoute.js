import express from 'express';
import {
  loginUser,
  registerUser,
  adminlogin,
  updateUser,
  deleteUser,
  verifyToken,
  getUserProfile
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.put('/update/:id', updateUser);
userRouter.delete('/delete/:id', deleteUser);
userRouter.get('/profile', verifyToken, getUserProfile);

export default userRouter;

import express from 'express';
import { userController } from './api/user/userController';
import * as dotenv from "dotenv";
import { authController } from './api/auth/authController';
import { verifyToken } from './utils/authorization';

const app = express();
const PORT = 8000;

dotenv.config({ path: __dirname+'/.env' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.send('Express + TypeScript Server, it is awesome!'));
app.get('/users', userController.getUsers);
app.get('/users/:id', verifyToken, userController.getUserById);
app.post('/users', userController.createUser);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

app.post("/login/getMagicLink", authController.sendTokenForLogin);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
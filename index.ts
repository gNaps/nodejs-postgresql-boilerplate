import express from 'express';
import { userController } from './api/user/userController';
import * as dotenv from "dotenv";
import { authController } from './api/auth/authController';
import { groupPolicyController } from './api/groupPolicy/groupPolicyController';
import { verifyToken, verifyPolicy } from './utils/authorization';

const app = express();
const PORT = 8000;

dotenv.config({ path: __dirname+'/.env' });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.send('Express + TypeScript Server, it is awesome!'));
app.get('/users',  userController.getUsers);
app.get('/users/:id', verifyToken, verifyPolicy, userController.getUserById);
app.post('/users',  verifyToken, verifyPolicy, userController.createUser);
app.put('/users/:id',  verifyToken, verifyPolicy, userController.updateUser);
app.delete('/users/:id',  verifyToken, verifyPolicy, userController.deleteUser);

app.post("/login/getMagicLink", authController.sendTokenForLogin);
app.post("/login/me", authController.getLoggedUserByToken);

app.get('/groupPolicy',  verifyToken, verifyPolicy, groupPolicyController.getGroupPolicies);
app.get('/groupPolicy/:id', verifyToken, verifyPolicy, groupPolicyController.getOneGroupPolicy);
app.post('/groupPolicy',  verifyToken, verifyPolicy, groupPolicyController.createGroupPolicy);
app.put('/groupPolicy/:id',  verifyToken, verifyPolicy, groupPolicyController.updateGroupPolicy);
app.delete('/groupPolicy/:id',  verifyToken, verifyPolicy, groupPolicyController.deleteGroupPolicy);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
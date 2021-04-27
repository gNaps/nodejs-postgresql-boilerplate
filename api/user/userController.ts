import { Request, Response } from 'express';
import { User } from '../../model/User';
import { userService } from './userService';

const getUsers = async (request: Request, response: Response) => {
    const { email } = request.query;

    if(!email) {
      const rows = await userService.getAll();
      response.status(200).json(rows);
    } else {
      const rows = await userService.getByEmail(email.toString());
      response.status(200).json(rows);
    }
}

const getUserById = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id)
    const rows = await userService.getById(id);
    response.status(200).json(rows);
}

const createUser = async (request: Request, response: Response) => {
    const user: User = request.body;
    const idInserted = await userService.createUser(user);
    const rows = await userService.getById(idInserted);
    response.status(200).json(rows);
}

const updateUser = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id)
    const user: User = { ...request.body, id: id };
    const idInserted = await userService.updateUser(user);
    const rows = await userService.getById(idInserted);
    response.status(200).json(rows);
}

const deleteUser = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id)
  console.log("sono in delete e cancello ", id)
  const result = await userService.deleteUser(id);
  console.log(result);

  if(result) {
    response.status(200).send(`User deleted with id: ${id}`);
  } else {
    response.status(400).send("Error");
  }
}

export const userController = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}
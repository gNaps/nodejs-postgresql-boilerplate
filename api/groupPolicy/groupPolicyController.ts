import { Request, Response } from 'express';
import { GroupPolicy } from '../../model/GroupPolicy';
import { groupPolicyServer } from './groupPolicyService';

/** GET di tutti i gruppi policies */
const getGroupPolicies = async (request: Request, response: Response) => {
    const rows = await groupPolicyServer.getAll();
    response.status(200).json(rows);
}

/** GET di un singolo gruppo policy (dato id) */
const getOneGroupPolicy = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id)
    const rows = await groupPolicyServer.getById(id);
    response.status(200).json(rows);
}

/** POST per creare un gruppo policy */
const createGroupPolicy = async (request: Request, response: Response) => {
    const user: GroupPolicy = request.body;
    const idInserted = await groupPolicyServer.createGroupPolicy(user);
    const rows = await groupPolicyServer.getById(idInserted);
    response.status(200).json(rows);
}

/** PUT per aggiornare un gruppo policy */
const updateGroupPolicy = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id)
    const gp: GroupPolicy = { ...request.body, id: id };
    const idInserted = await groupPolicyServer.updateGroupPolicy(gp);
    const rows = await groupPolicyServer.getById(idInserted);
    response.status(200).json(rows);
}

/** DELETE per eliminare un gruppo policy */
const deleteGroupPolicy = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id)
  const result = await groupPolicyServer.deleteGroupPolicy(id);
  console.log(result);

  if(result) {
    response.status(200).send(`User deleted with id: ${id}`);
  } else {
    response.status(400).send("Error");
  }
}

export const groupPolicyController = {
    getGroupPolicies,
    getOneGroupPolicy,
    createGroupPolicy,
    updateGroupPolicy,
    deleteGroupPolicy
}
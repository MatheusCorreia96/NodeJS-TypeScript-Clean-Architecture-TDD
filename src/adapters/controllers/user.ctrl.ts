import { NextFunction, Request, Response } from 'express';
import CreateUserBs from '@interactors/user/create/create-user.bs';
import { CreateUserInput } from '@interactors/user/create/create-user.types';
import GetUserBs from '@interactors/user/get/get-user.bs';
import { GetUserInput } from '@interactors/user/get/get-user.types';

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    const createUserBs: CreateUserBs = req.container.resolve('createUserBs');
    
    const input: CreateUserInput = {
      ...req.body
    };

    try{
      await createUserBs.execute(input);
      res.status(201).end()
    } catch(err){
      next(err);
    }
  },

  get: async (req: Request, res: Response, next: NextFunction) => {
    const getUserBs: GetUserBs = req.container.resolve('getUserBs');
    
    const input: GetUserInput = {
      ...req.body
    };

    try{
      const output = await getUserBs.execute(input);
      res.status(200).json(output)
    } catch(err){
      next(err);
    }
  }
};
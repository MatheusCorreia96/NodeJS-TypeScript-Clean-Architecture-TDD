import { NextFunction, Request, Response } from 'express';
import CreateUserBs from '@interactors/user/create/create-user.bs';
import { CreateUserInput } from '@interactors/user/create/create-user.types';

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
  }
};
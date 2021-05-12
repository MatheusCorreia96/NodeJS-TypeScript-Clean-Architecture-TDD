import { NextFunction, Request, Response } from 'express';
import IncrementAccessCountBs from '@interactors/access-count/increment/increment-access-count.bs';
import GetAccessCountBs from '@interactors/access-count/get/get-access-count.bs';

import path from 'path';

export default {
  increment: async (req: Request, res: Response, next: NextFunction) => {
    const incrementAccessCountBs: IncrementAccessCountBs = req.container.resolve('incrementAccessCountBs');
    
    try{
      const output = await incrementAccessCountBs.execute();

      res.status(201).json({count: output})
    } catch(err){
      next(err);
    }
  },

  getCount: async (req: Request, res: Response, next: NextFunction) => {
    const getAccessCountBs: GetAccessCountBs = req.container.resolve('getAccessCountBs');
    
    try{
      const output = await getAccessCountBs.execute();

      res.status(201).json({count: output})
    } catch(err){
      next(err);
    }
  },
};
import { NextFunction, Request, Response } from 'express';
import PostAccessCountBs from '@interactors/access-count/access-count.bs';

import path from 'path';

export default {
  increment: async (req: Request, res: Response, next: NextFunction) => {
    const postAccessCount: PostAccessCountBs = req.container.resolve('accessCountBs');
    
    try{
      const output = await postAccessCount.execute();

      res.status(201).json({count: output})
    } catch(err){
      next(err);
    }
  }
};
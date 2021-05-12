import { asValue, AwilixContainer } from 'awilix';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export default (container: AwilixContainer) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const scope = container.createScope();

    const uuid = <string>req.headers['x-request-id'] || uuidv4();

    scope.register({
      requestId: asValue(uuid),
    });

    req.container = scope;

    res.setHeader('x-request-id', uuid);

    next();
  };
};
import JsonHandler from '@adapters/handlers/json.handler';
import { NextFunction, Request, Response } from 'express';

export default (schemaName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate: { headers?: any, params?: any, query?: any, body?: any } = {};

    dataToValidate.headers = req.headers;

    if (Object.keys(req.params).length !== 0) {
      dataToValidate.params = req.params;
    }

    if (Object.keys(req.query).length !== 0) {
      dataToValidate.query = req.query;
    }

    if (Object.keys(req.body).length !== 0) {
      dataToValidate.body = req.body;
    }

    try {
      await (<JsonHandler>req.container.resolve('jsonHandler'))
        .validate(schemaName, dataToValidate);
    } catch (err) {
      next(err);
    }

    next();
  };
};
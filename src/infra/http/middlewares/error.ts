import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'infra/http/http-server';
import { ApplicationError } from 'infra/tools/errors/application';

export default (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  let status = err.status || 500;
  let errorResponse: any = {};

  if (err instanceof ApplicationError) {
    console.log('HTTP request error', { err });

    status = 400;

    errorResponse = {
      nome: err.name,
      mensagem: err.message
    }; 

  } else {
    console.log('HTTP request unknown error', { err });

    errorResponse = {
      nome: 'erro_interno_servidor',
      mensagem: 'Erro interno do servidor'
    };
  }

  res.status(status).json(errorResponse);

  next(err);
};
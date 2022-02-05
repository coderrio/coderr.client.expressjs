import { NextFunction, Request, Response } from 'express';
import { NodeJsContext } from '../context';
import { HttpError } from '../error';
import { pipeline } from '../reporting';
import { coderrMiddleware } from './coderr';

export function errorMiddleware(
    error: TypeError | HttpError,
    request: Request,
    response: Response,
    next: NextFunction
) {
    let statusCode = response.statusCode;
    if (error instanceof HttpError) {
        const status = (<HttpError>error).httpStatusCode;
        if (status > 0) {
            statusCode = status;
        }
    }

    const context = new NodeJsContext(coderrMiddleware, error);
    context.request = request;
    context.response = response;
    pipeline.reportByContext(context);

    // next(error);
    response.status(statusCode).send(error.message);
    next(error);

    // response
    //     .status(statusCode)
    //     .send({
    //         status: statusCode,
    //         message: error.message,
    //     });
}

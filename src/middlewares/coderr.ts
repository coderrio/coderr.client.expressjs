import * as coderr from 'coderr.client';
import { NextFunction, Request, Response } from 'express';
import { NodeJsContext } from '../context';
import { pipeline } from '../reporting';

/**
 * Amount of time that a request may take (milliseconds).
 */
export var requestTimeThreshold: number = 0;

/**
 * Fine-tune request thresholds per request method.
 *
 * @example requestMethodTimeThresholds['post'] = 500;
 */
export var requestMethodTimeThresholds: any = {};

/**
 * Report requests that generate 403 errors.
 */
export var reportForbidden = false;

/**
 * Checks if any requests are too slow or generated an 403 error.
 */
export function coderrMiddleware(request: Request, response: Response, next: NextFunction) {
    const start = new Date();
    try {
        next();

        const result = isTooSlow(request, start);
        if (result.tooSlow) {
            const context = new NodeJsContext(
                coderrMiddleware,
                new Error(`Slow request ${result.elapsedMs}: ${request.url}`)
            );
            context.request = request;
            context.response = response;
            pipeline.reportByContext(context);
        }
        if (response.statusCode == 403 && reportForbidden) {
            const context = new NodeJsContext(
                coderrMiddleware,
                new Error(`Forbidden ${request.url}`)
            );
            context.request = request;
            context.response = response;
            coderr.features.addTagToContext(context, 'forbidden');
            pipeline.reportByContext(context);
        }
    } catch (error) {
        next(error);
    }
}

class SlowResult {
    constructor(public tooSlow: boolean, public elapsedMs: number) {}
}

function isTooSlow(request: Request, start: Date): SlowResult {
    const end = new Date();
    var method = request.method.toLowerCase();

    var threshold = requestTimeThreshold;
    if (requestMethodTimeThresholds.hasOwnProperty(method)) {
        threshold = requestMethodTimeThresholds[method];
    }

    const duration = end.getTime() - start.getTime();
    var result = new SlowResult(duration > threshold, duration);
    return result;
}

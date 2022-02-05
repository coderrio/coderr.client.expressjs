import { CoderrError } from 'coderr.client';

/**
 * Error which
 */
export class HttpError extends CoderrError {
    /**
     *
     * @param httpStatusCode HTTP status code to return
     * @param message Message to display.
     */
    constructor(public httpStatusCode: number, message: string = 'Internal server error') {
        super(message);
        this.httpStatusCode = httpStatusCode;
    }

    /**
     * If specified, it will be shown for the user.
     */
    httpStatusDescription?: string;
}

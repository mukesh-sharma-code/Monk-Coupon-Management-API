import { NextFunction, Request, Response } from 'express';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
    const method = req.method || '';
    const url = req.originalUrl || '';
    console.log(`\nURL ---> ${method} ---> ${url}`);
    next();
}
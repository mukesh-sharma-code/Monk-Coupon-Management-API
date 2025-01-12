import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from './statusCodes';
import { ResponseMessages } from './enums/reponseMessages';

interface SuccessResponse {
  statusCode: StatusCodes;
  data?: any;
  message?: string;
}

interface ErrorResponse {
  statusCode: StatusCodes;
  message?: string;
  error?: any;
}
const logger = {
    error: (error: Error) => {
      console.error('Error:', error);
    },
};
export const responseHelper = {
  success: (res: Response, { statusCode, data, message }: SuccessResponse) => {
    res.status(statusCode).json({
      success: true,
      message: message || ResponseMessages.SUCCESS,
      data,
    });
  },

  error: (res: Response, { statusCode, message, error }: ErrorResponse) => {
    // Log the actual error message
    logger.error(error);

    res.status(statusCode).json({
      success: false,
      message: message || ResponseMessages.ERROR,
      error: null, // Do not expose internal error details to the client
    });
  },
};
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  };
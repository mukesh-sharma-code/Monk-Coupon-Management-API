import express from "express";
import {
   validate,
   // Matches,
   // IsDefined,
   ValidationError
} from "class-validator";

import { plainToClass, Expose } from "class-transformer";
import { responseHelper } from "../utils/response.helper";
import { StatusCodes } from "../utils/statusCodes";
import { ResponseMessages } from "../utils/enums/reponseMessages";


export function ValidationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
   return (req, res, next) => {
      validate(plainToClass(type, req.body), { skipMissingProperties })
         .then((errors: ValidationError[]) => {
            if (errors.length > 0) {
               let errMsg: string = '';
               let errData: {}[] = [];
               let errCount: number = 0;

               for (const errorItem of errors) {
                  errData.push({
                     [errorItem.property]: errorItem.constraints
                  })
                  // errorItem.property: errorItem.constraints
                  if(errorItem.constraints ){                     
                     for (const [key, value] of Object.entries(errorItem.constraints)) {                        
                        if(errCount > 1){
                           errMsg += ', ';
                        }
                        errMsg += value;                        
                        ++errCount;
                     }
                  }
               }
               const resMsg = {
                  message: errMsg,
                  data: errData
               };
               return responseHelper.error(res, {
                statusCode: StatusCodes.BAD_REQUEST,
                message: ResponseMessages.ERROR,
                error:errMsg,
              });
            } else {
               next();
            }
         });
   };
}


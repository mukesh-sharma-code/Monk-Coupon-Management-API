import 'reflect-metadata';

import * as dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from './utils/response.helper'
import { Request, Response } from 'express';
import { couponRoutes } from './modules/coupon/coupon.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(async (req: Request, res: Response, next: NextFunction) => {
  
  // Log api
  let method: string = req.method ? req.method : "";
  let url: string = req?.originalUrl ? req?.originalUrl : "";
  console.error(`\nURL >>`, method, `----->`, url);
  console.log(`req.body >>`, req.body);
  console.log(`req.query >>`, req.query);
  next();
});
app.use('/api', couponRoutes.router);


// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
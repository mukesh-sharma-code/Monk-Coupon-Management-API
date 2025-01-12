import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cluster from 'cluster';
import os from 'os';
import { errorHandler } from './utils/response.helper';
import CouponRoutes from './modules/coupon/coupon.routes';
import { loggingMiddleware } from './middlewares/request_payload_logging';

class App {
  public app: express.Application;
  private couponRoutes: CouponRoutes;

  constructor() {
    this.app = express();
    this.couponRoutes = new CouponRoutes();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  // Initialize middlewares
  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(loggingMiddleware);
  }
  

  // Initialize routes
  private initializeRoutes() {
    this.app.use('/api', this.couponRoutes.router);
  }

  // Initialize error handling
  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  // Start the server using cluster package
  public startClusterServer(port: number | string) {
    if (cluster.isPrimary) {
      // Primary process: Fork workers
      const numCPUs = os.cpus().length;
      console.log(`Primary process is running. Forking for ${numCPUs} CPUs...`);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      // Handle worker exit
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
      });
    } else {
      // Worker process: Start the server
      this.app.listen(port, () => {
        console.log(`Worker ${process.pid} is running on port ${port}`);
      });
    }
  }

  // Start the server
  public start(port: number | string) {
    this.app.listen(port, () => {
       console.log(`Server is running on port ${port}`);
    });
 }
}

export default App;
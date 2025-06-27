/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

//parsers
app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://taasu-soap.web.app',
      'http://localhost:5174',
    ],
    credentials: true,
  }),
);

app.get('/api/v1/test', async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'test',
    data: null,
  });
});

// application routes
app.use('/api/v1', router);

//Global Error Handler
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;

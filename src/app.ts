import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/route';
const app: Application = express();
// const port = 3000;

// parsers
app.use(express.json());
app.use(cors());

// application routes

app.use('/api/v1', router);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});



app.use(globalErrorHandler)
app.use(notFound)


export default app;

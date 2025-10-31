import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './Routes/userRoutes';
import authenticate from './Middlewares/authMiddleWare';
import refreshRouter from './Routes/tokenRoutes';
import errorHandler from './Middlewares/errorMiddleWare';
import templateRouter from './Routes/templateRoutes';
import exerciseRouter from './Routes/exerciseRoutes';
import workoutRouter from './Routes/workoutRoutes';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/refresh', refreshRouter);

app.use(authenticate);
app.use('/template', templateRouter);
app.use('/exercise', exerciseRouter);
app.use('/workout', workoutRouter);

app.use(errorHandler);

export default app;

// server.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import quizzRoutes from './routes/quizzRoute.js';
import scoreRoutes from './routes/scoreRoutes.js';



const app = express();

app.use(
  cors({
    origin: '*', // or specific origin like 'https://your-app-url.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Base router for /api
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/quizz', quizzRoutes);
apiRouter.use('/', scoreRoutes);

app.use('/api', apiRouter); // All routes now start with /api


app.listen(process.env.PORT, () => {
  console.log(`Server running.....`);
});

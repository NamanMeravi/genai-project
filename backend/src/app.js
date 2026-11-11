import express from 'express'
import authroute from './routes/auth.route.js';

const app = express()

app.use(express.json());

app.use('/api/auth',authroute);

export default app;
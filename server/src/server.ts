import express from 'express';
import healthRoute from './routes/health';
import authRoutes from "./routes/auth.route"
import dotenv from "dotenv";
import { env } from './config/env';

dotenv.config();

const app = express();
const PORT  = env.PORT;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/health', healthRoute);

app.listen(PORT,()=>{
    console.log(`server running on ${PORT} `);
});

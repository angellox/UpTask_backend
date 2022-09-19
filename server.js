import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Reading JSON data
app.use(express.json());
dotenv.config();

// CORS Policy
const whiteList = [process.env.FRONTEND_URL_PRIMARY, process.env.FRONTEND_URL_SECONDARY];
const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.includes(origin)) {
            // Allow domains to access API
            callback(null, true);
        } else {
            // Not allowed by other domains
            callback(new Error('Error by CORS'));
        }
    }
};
app.use(cors(corsOptions));

// Routing
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
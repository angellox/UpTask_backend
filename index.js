import app from './server.js';
import dotenv from 'dotenv';
import connectionDB from './config/db.js';

// Configuring app (db, env)
dotenv.config();
connectionDB();

// Server connection
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Socket.io connection
import { Server } from 'socket.io';

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
});

io.on('connection', (socket) => {
    //console.log('Connected to Socket.io');
    // Definition of Socket.io events
    socket.on('open project', (project) => {
        socket.join(project);
    });
    socket.on('new task', (task) => {
        const project = task.project;
        socket.to(project).emit('task added', task);
    });

    socket.on('delete task', (task) => {
        const project = task.project
        socket.to(project).emit('task deleted', task);
    });

    socket.on('edit task', (task) => {
        const project = task.project._id;
        socket.to(project).emit('task updated', task);
    });

    socket.on('change status', (task) => {
        const project = task.project._id;
        socket.to(project).emit('new status', task);
    });
});


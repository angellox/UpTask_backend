import mongoose from 'mongoose';

const connectionDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const dataConnection = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB is connected on: ${dataConnection}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        // Ends up all the process so it cannot continue to run the application
        process.exit(1);
    }
}

export default connectionDB;

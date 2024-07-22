import mongoose from 'mongoose';

let isConnected = false; // variable to check connection status (if mongoose is connected)

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    if (!process.env.MONGODB_URL) return console.log('MOONGODB_URL not found!');
    if (isConnected) {
        console.log('Already connected to mongoDB');
        return;
    }

    try {
        const mongoDB_URL = process.env.MONGODB_URL;
        await mongoose.connect(mongoDB_URL, {
            autoIndex: true,
            serverSelectionTimeoutMS: 30000
        });
        isConnected = true;
        console.log("connected to mongoDB")
    } catch (error) {
        console.error(error);
    }
}
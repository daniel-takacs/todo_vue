import express from 'express';
import mongoose from 'mongoose';
import todoRoutes from './routes/todo.routes';
import cors from 'cors'
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;
app.use(cors({
  origin: 'http://localhost:8080' // frontend server address
}));
app.use(express.json());
const mongoUri = process.env.DB_URL;
// MongoDB Connection
// const mongoUri = 'mongodb://localhost:27017/todoApp';

if (!mongoUri) {
  console.error('MongoDB URL is not defined in the environment variables.');
} else {
  mongoose
    .connect(mongoUri, {
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
}


app.use('/api', todoRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

import express from 'express';
import mongoose from 'mongoose';
import todoRoutes from './routes/todo.routes';

const app = express();
const port = 3000;

app.use(express.json());

// MongoDB Connection
const mongoUri = 'mongodb://localhost:27017/todoApp';
mongoose.connect(mongoUri, {
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', todoRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

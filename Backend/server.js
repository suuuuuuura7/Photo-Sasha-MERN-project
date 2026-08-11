import express from 'express'
import 'dotenv/config'
import { connectDB } from './config/db.js';


const app = express();
const PORT = process.env.PORT || 5002

app.use(express.json());

app.get('/', (req, res) => {
    res.send("the server is running")
})


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});

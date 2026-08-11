import express from 'express'
import 'dotenv/config'


const app = express();
const PORT = process.env.PORT || 5002

app.use(express.json());

app.get('/', (req, res) => {
    res.send("the server is running")
})

app.listen(PORT, () => {
    console.log(`Server os running on port ${PORT}`);
})
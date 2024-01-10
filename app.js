import express from "express";
import paddle from "@paddle/paddle-js"
import 'dotenv/config';


const app = express();

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile("index.html", { root : "public" })
})

app.get('/404', (req, res) => {
    res.sendFile("guide.html", { root : "public" })
})

app.use((req, res) => {
    res.redirect('/404')
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})
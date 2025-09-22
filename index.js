import express, { Router } from 'express';;
import {mockuser} from "./components/mockuser.js";
import cors from 'cors';
const app = express();
const port = 9000;

app.use(cors());


app.use(express.json());


app.use('/api/mockuser', mockuser);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port, () => {
  console.log(`mock driver listening at http://localhost:${port}`);
});

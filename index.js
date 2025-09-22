const express = require("express");
import api from './src/api.js';
const app = express();
const port = 3000;

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/mockuser', mockuser);

app.get("/", (req, res) => {
  res.send("Hello World!");});
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

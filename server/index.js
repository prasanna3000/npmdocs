const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require('./routes/user');
const packageRouter = require('./routes/package');
const functionRouter = require('./routes/function');
const { router } = require('./routes/task');
const cors = require('cors');

require('./db/connection');

const PORT = 8000;
const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/api/', (req, res) => {
    console.log('/GET is called');
    return res.status(200).json('success');
});

app.use('/api/user/', userRouter);
app.use('/api/package', packageRouter);
app.use('/api/function', functionRouter);
app.use('/api/task', router);

app.listen(PORT, () => {
  console.log("APP started working on PORT:", PORT);
});

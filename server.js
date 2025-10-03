const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventAPI = require("./controllerAPI/api-controller");

const app = express();


app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use("/api/events", eventAPI);


const PORT = 3060;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});

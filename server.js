const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventAPI = require("./controllerAPI/api-controller");

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/events", eventAPI);

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.url);
  res.status(404).json({ error: 'Not found' });
});

const PORT = 3060;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/events`);
});

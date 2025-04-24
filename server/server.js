const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let users = [];
let messages = [];

app.post("/users", (req, res) => {
  const { username } = req.body;
  if (!users.includes(username)) users.push(username);
  res.sendStatus(200);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/messages", (req, res) => {
  const { username, text } = req.body;
  const message = { username, text, time: new Date().toISOString() };
  messages.push(message);
  res.status(200).json(message);
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

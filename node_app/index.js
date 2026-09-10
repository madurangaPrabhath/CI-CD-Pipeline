const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ response: "Hello, Welcome to World" });
});

app.get("/will", (req, res) => {
  res.json({ response: "Hello World" });
});

app.get("/ready", (req, res) => {
  res.json({ response: "Great!, It works!" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

module.exports = app;
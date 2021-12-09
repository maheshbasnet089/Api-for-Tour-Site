const app = require("./app");
const mongoConnection = require("./database/db");

const dotenv = require("dotenv");
const router = require("./routes /tourRoute");
dotenv.config();

mongoConnection(process.env.MONGO_URI);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`serving at port ${PORT}`);
});

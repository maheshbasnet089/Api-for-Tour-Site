const app = require("./app");
const mongoConnection = require("./database/db");

// process.on("uncaughtException", (err) => {
//   console.log("Uncaught Exception , shutting down ...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const dotenv = require("dotenv");
const router = require("./routes /tourRoute");
dotenv.config();

mongoConnection(process.env.MONGO_URI);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`serving at port ${PORT}`);
});

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   console.log("Unhandled Rejection ✨ ");
//   server.close((err) => {
//     process.exit(1);
//   });
// });

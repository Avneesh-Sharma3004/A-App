require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const http = require("http");
const { initSocket } = require("./src/socket");

const PORT = process.env.PORT || 1800;

connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server chal gaya ${PORT}`);
});

// Start Server
const app = require("./src/app");
const dotenv = require("dotenv");
const connectDB = require("./src/db/db");

dotenv.config();

const port = process.env.PORT || 3000;
connectDB();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

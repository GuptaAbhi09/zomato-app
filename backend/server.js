// Start Server
const app = require("./src/app");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

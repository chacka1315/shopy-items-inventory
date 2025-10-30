import express from "express";
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

//setup
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//global middlewares
app.use((req, res, next) => {
  console.log(`${req.method} reqauest with path ${req.path}`);
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

const PORT = process.env.PORT || 10000;
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log("🌎 Server is running on PORT ", PORT);
});

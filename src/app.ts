import express from "express";
import cors from "cors";
import https from "https";
import cron from "node-cron";
import { sayHelloController } from "./controllers";
import { memberRoute, proRoute, pubRoute, eveRoute } from "./routes";
import { errorHandler } from "./middlewares";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function keepAlive(url: string) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
    })
    .on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
}

// cron job to ping the server every minute and delete expired tokens every 5 minutes
cron.schedule("*/5 * * * *", () => {
  keepAlive("");
  console.log("pinging the server every minute");
});

app.get("/", sayHelloController);
app.use("/api/v1/members", memberRoute);
app.use("/api/v1", proRoute);
app.use("/api/v1", pubRoute);
app.use("/api/v1", eveRoute);

app.use(errorHandler);

app.use(cors());
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

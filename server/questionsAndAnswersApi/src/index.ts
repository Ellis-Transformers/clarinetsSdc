// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { router } from "./routes/routes";
dotenv.config();

if(!process.env.PORT) {
  process.exit(1);
}
const PORT:number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", router);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

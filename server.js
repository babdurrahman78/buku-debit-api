import express from "express";
import jalurRouter from "./routes/jalur.js";
import cors from "cors";
import recordRoutes from "./routes/recordJalurBersih.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/jalur", jalurRouter);
app.use("/record-jalur-bersih", recordRoutes);

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

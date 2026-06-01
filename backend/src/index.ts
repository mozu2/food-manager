import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import categoryRoutes from "./routes/categoryRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ success: true, message: "サーバー起動中" });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});

app.use("/api/categories", categoryRoutes); //urlの後に続く処理をcategoryRoutesでしている。

app.use(errorHandler);
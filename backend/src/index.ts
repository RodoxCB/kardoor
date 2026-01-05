import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import contractsRouter from "./routes/contracts";
import dashboardRouter from "./routes/dashboard";
import locationsRouter from "./routes/locations";
import kmrRouter from "./routes/kmr";
import partnersRouter from "./routes/partners";
import motoristasRouter from "./routes/motoristas";
import campanhasRouter from "./routes/campanhas";
import recompensasRouter from "./routes/recompensas";
import pagamentosRouter from "./routes/pagamentos";
import inscricoesRouter from "./routes/inscricoes";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API KMR rodando", version: "0.1.0" });
});

app.use("/contracts", contractsRouter);
app.use("/locations", locationsRouter);
app.use("/kmr", kmrRouter);
app.use("/dashboard", dashboardRouter);
app.use("/partners", partnersRouter);
app.use("/motoristas", motoristasRouter);
app.use("/campanhas", campanhasRouter);
app.use("/recompensas", recompensasRouter);
app.use("/pagamentos", pagamentosRouter);
app.use("/parceiros/inscricao", inscricoesRouter);
app.use("/auth", authRouter);

app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada" }));

app.listen(port, () => {
  console.log(`Backend KMR ouvindo na porta ${port}`);
});

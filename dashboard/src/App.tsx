import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MotoristaDashboard from "./pages/motorista/Dashboard";
import MotoristaAgendar from "./pages/motorista/Agendar";
import MotoristaRodagem from "./pages/motorista/Rodagem";
import MotoristaPontos from "./pages/motorista/Pontos";
import AnuncianteDashboard from "./pages/anunciante/Dashboard";
import AnuncianteCampanha from "./pages/anunciante/NovaCampanha";
import AnunciantePagamento from "./pages/anunciante/Pagamento";
import ParceiroInscricao from "./pages/parceiro/Inscricao";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/motorista" element={<MotoristaDashboard />} />
      <Route path="/motorista/agendar" element={<MotoristaAgendar />} />
      <Route path="/motorista/rodagem" element={<MotoristaRodagem />} />
      <Route path="/motorista/pontos" element={<MotoristaPontos />} />
      <Route path="/anunciante" element={<AnuncianteDashboard />} />
      <Route path="/anunciante/campanha" element={<AnuncianteCampanha />} />
      <Route path="/anunciante/pagamento" element={<AnunciantePagamento />} />
      <Route path="/parceiro" element={<ParceiroInscricao />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;

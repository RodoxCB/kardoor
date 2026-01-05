import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthScreen from "./pages/AuthScreen";
import RequireArea from "./components/RequireArea";
import { AuthProvider } from "./context/AuthContext";
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
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route
          path="/motorista"
          element={
            <RequireArea area="motorista">
              <MotoristaDashboard />
            </RequireArea>
          }
        />
        <Route
          path="/motorista/agendar"
          element={
            <RequireArea area="motorista">
              <MotoristaAgendar />
            </RequireArea>
          }
        />
        <Route
          path="/motorista/rodagem"
          element={
            <RequireArea area="motorista">
              <MotoristaRodagem />
            </RequireArea>
          }
        />
        <Route
          path="/motorista/pontos"
          element={
            <RequireArea area="motorista">
              <MotoristaPontos />
            </RequireArea>
          }
        />
        <Route
          path="/anunciante"
          element={
            <RequireArea area="anunciante">
              <AnuncianteDashboard />
            </RequireArea>
          }
        />
        <Route
          path="/anunciante/campanha"
          element={
            <RequireArea area="anunciante">
              <AnuncianteCampanha />
            </RequireArea>
          }
        />
        <Route
          path="/anunciante/pagamento"
          element={
            <RequireArea area="anunciante">
              <AnunciantePagamento />
            </RequireArea>
          }
        />
        <Route
          path="/parceiro"
          element={
            <RequireArea area="parceiro">
              <ParceiroInscricao />
            </RequireArea>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, Text, View } from "react-native";
import * as Location from "expo-location";
import api from "../services/api";

type ContractSummary = {
  id: number;
  status: string;
  kmsMeta: number;
  valor: number;
  motorista: { nome: string };
};

const DriverDashboard = () => {
  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationState, setLocationState] = useState("KMR aguardando");

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data?: ContractSummary[] }>("/contracts");
      setContracts(response.data ?? []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível recuperar contratos");
    } finally {
      setLoading(false);
    }
  };

  const pushLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos da localização para calcular KMR");
        return;
      }

      if (!contracts[0]) {
        Alert.alert("Sem contrato ativo", "Ative um contrato antes de enviar dados.");
        setLocationState("Nenhum contrato ativo");
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setLocationState("Enviando registro...");

      await api.post("/locations", {
        contratoId: contracts[0]?.id ?? 0,
        quilometros: 1,
        duracaoAtualizada: 1,
        areaBonificada: true,
        localizacao: `${position.coords.latitude},${position.coords.longitude}`,
      });

      setLocationState("Registro enviado com sucesso");
      fetchContracts();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a localização");
      setLocationState("Falha ao enviar");
    }
  };

  const highlightContract = contracts[0];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
        Painel do motorista
      </Text>
      <Text style={{ marginBottom: 8 }}>{locationState}</Text>
      {highlightContract ? (
        <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderRadius: 8 }}>
          <Text style={{ fontWeight: "600" }}>Contrato #{highlightContract.id}</Text>
          <Text>Status: {highlightContract.status}</Text>
          <Text>Meta de km: {highlightContract.kmsMeta}</Text>
          <Text>Valor estimado: R${highlightContract.valor.toFixed(2)}</Text>
        </View>
      ) : (
        <Text style={{ marginBottom: 16 }}>Nenhum contrato ativo encontrado.</Text>
      )}

      <Button title="Enviar registro KMR" onPress={pushLocation} disabled={loading} />

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Histórico de contratos</Text>
        {contracts.map((contract) => (
          <View
            key={contract.id}
            style={{ marginVertical: 8, padding: 10, borderWidth: 1, borderRadius: 6 }}
          >
            <Text>ID: {contract.id}</Text>
            <Text>Motorista: {contract.motorista.nome}</Text>
            <Text>Status: {contract.status}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DriverDashboard;

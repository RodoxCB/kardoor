import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, Text, View } from "react-native";
import api from "../services/api";

type Verification = {
  id: number;
  contratoId: number;
  parceiroId: string;
  integridade: string;
  checkinInicio: string;
};

const PartnerChecklist = () => {
  const [records, setRecords] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await api.get<Verification[]>("/partners");
      setRecords(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as verificações");
    } finally {
      setLoading(false);
    }
  };

  const startVerification = async (contratoId: number) => {
    try {
      await api.post("/partners/check-in", {
        contratoId,
        parceiroId: "partner-101",
      });
      Alert.alert("Sucesso", "Check-in registrado");
      refresh();
    } catch (error) {
      Alert.alert("Erro", "Falha ao registrar o início");
    }
  };

  const finalizeVerification = async (contratoId: number) => {
    try {
      await api.post("/partners/check-out", { contratoId });
      Alert.alert("Sucesso", "Check-out confirmado");
      refresh();
    } catch (error) {
      Alert.alert("Erro", "Falha ao confirmar o fim");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>
        Painel do parceiro
      </Text>
      <Button title="Atualizar verificações" onPress={refresh} disabled={loading} />

      {records.map((record) => (
        <View
          key={record.id}
          style={{ marginVertical: 12, borderWidth: 1, padding: 12, borderRadius: 8 }}
        >
          <Text style={{ fontWeight: "600" }}>Contrato #{record.contratoId}</Text>
          <Text>Parceiro: {record.parceiroId}</Text>
          <Text>Integridade: {record.integridade}</Text>
          <Text>Início: {new Date(record.checkinInicio).toLocaleString()}</Text>
          <View style={{ marginTop: 8, flexDirection: "row" }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Button title="Confirmar início" onPress={() => startVerification(record.contratoId)} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Finalizar" onPress={() => finalizeVerification(record.contratoId)} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default PartnerChecklist;

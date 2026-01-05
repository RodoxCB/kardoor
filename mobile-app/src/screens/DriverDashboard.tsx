import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import api from "../services/api";
import { palette, spacing } from "../theme";
import AppButton from "../components/AppButton";

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel do motorista</Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>{locationState}</Text>
      </View>

      {highlightContract ? (
        <View style={styles.contractCard}>
          <Text style={styles.contractTitle}>Contrato #{highlightContract.id}</Text>
          <Text style={styles.contractCopy}>Status: {highlightContract.status}</Text>
          <Text style={styles.contractCopy}>Meta de km: {highlightContract.kmsMeta}</Text>
          <Text style={styles.contractCopy}>
            Valor estimado: R${highlightContract.valor.toFixed(2)}
          </Text>
        </View>
      ) : (
        <View style={styles.contractCard}>
          <Text style={styles.contractCopy}>Nenhum contrato ativo encontrado.</Text>
        </View>
      )}

      <ActionButton title="Enviar registro KMR" onPress={pushLocation} loading={loading} />

      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Histórico de contratos</Text>
        {contracts.map((contract) => (
          <View key={contract.id} style={styles.historyItem}>
            <Text style={styles.historyLabel}>ID: {contract.id}</Text>
            <Text style={styles.historyLabel}>Motorista: {contract.motorista.nome}</Text>
            <Text style={styles.historyLabel}>Status: {contract.status}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: palette.background,
    minHeight: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: palette.text,
    marginBottom: spacing.sm,
  },
  statusCard: {
    backgroundColor: palette.card,
    padding: spacing.md,
    borderRadius: spacing.lg,
    borderColor: palette.border,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  statusText: {
    color: palette.text,
  },
  contractCard: {
    backgroundColor: palette.card,
    padding: spacing.md,
    borderRadius: spacing.lg,
    borderColor: palette.border,
    borderWidth: 1,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  contractTitle: {
    color: palette.text,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  contractCopy: {
    color: palette.textMuted,
    marginBottom: spacing.xs,
  },
  historyContainer: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  historyItem: {
    backgroundColor: palette.cardAccent,
    padding: spacing.md,
    borderRadius: spacing.lg,
    marginBottom: spacing.sm,
    borderColor: palette.border,
    borderWidth: 1,
  },
  historyLabel: {
    color: palette.textMuted,
  },
});

export default DriverDashboard;

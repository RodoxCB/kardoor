import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import api from "../services/api";
import AppButton from "../components/AppButton";
import { palette, spacing } from "../theme";

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel do parceiro</Text>
      <AppButton title="Atualizar verificações" onPress={refresh} loading={loading} />
      {statusMessage && <Text style={styles.status}>{statusMessage}</Text>}

      {records.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View>
            <Text style={styles.contractLabel}>Contrato #{record.contratoId}</Text>
            <Text style={styles.recordText}>Parceiro: {record.parceiroId}</Text>
            <Text style={styles.recordText}>Integridade: {record.integridade}</Text>
            <Text style={styles.recordText}>
              Início: {new Date(record.checkinInicio).toLocaleString()}
            </Text>
          </View>
          <View style={styles.recordActions}>
            <AppButton
              title="Confirmar início"
              onPress={() => startVerification(record.contratoId)}
              variant="ghost"
              style={[styles.smallButton, styles.actionSpacing]}
            />
            <AppButton
              title="Finalizar"
              onPress={() => finalizeVerification(record.contratoId)}
              variant="ghost"
              style={styles.smallButton}
            />
          </View>
        </View>
      ))}
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
    fontSize: 24,
    fontWeight: "700",
    color: palette.text,
    marginBottom: spacing.sm,
  },
  status: {
    color: palette.success,
    marginBottom: spacing.sm,
  },
  recordCard: {
    backgroundColor: palette.card,
    borderRadius: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  contractLabel: {
    color: palette.text,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  recordText: {
    color: palette.textMuted,
  },
  recordActions: {
    flexDirection: "row",
    marginTop: spacing.sm,
  },
  smallButton: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  actionSpacing: {
    marginRight: spacing.sm,
  },
});

export default PartnerChecklist;

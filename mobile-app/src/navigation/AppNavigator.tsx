import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DriverDashboard from "../screens/DriverDashboard";
import PartnerChecklist from "../screens/PartnerChecklist";
import { palette } from "../theme";

export type AppStackParamList = {
  Driver: undefined;
  Partner: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Driver"
      screenOptions={{
        headerStyle: { backgroundColor: palette.card },
        headerTintColor: palette.text,
        headerTitleStyle: { fontWeight: "600" },
        contentStyle: { backgroundColor: palette.background },
      }}
    >
      <Stack.Screen name="Driver" component={DriverDashboard} options={{ title: "Motorista" }} />
      <Stack.Screen name="Partner" component={PartnerChecklist} options={{ title: "Parceiro" }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

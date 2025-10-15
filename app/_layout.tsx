import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: "المكتبة" }} />
        <Stack.Screen name="pdf-viewer" options={{ headerTitleAlign: "center" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

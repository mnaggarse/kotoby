import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: "المكتبة" }} />
        <Stack.Screen name="pdf-viewer" />
      </Stack>
    </GestureHandlerRootView>
  );
}

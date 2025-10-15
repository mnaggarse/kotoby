import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "المكتبة" }} />
        <Stack.Screen name="pdf-viewer" options={{ title: "" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

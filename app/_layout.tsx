import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="pdf-viewer" options={{ title: "PDF Viewer" }} />
    </Stack>
  );
}

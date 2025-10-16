import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "ibm-regular": require("../assets/fonts/ibm-regular.ttf"),
    "ibm-medium": require("../assets/fonts/ibm-medium.ttf"),
    "ibm-bold": require("../assets/fonts/ibm-bold.ttf"),
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "ibm-bold" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "المكتبة" }} />
        <Stack.Screen name="pdf-viewer" options={{ headerTitleAlign: "center" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

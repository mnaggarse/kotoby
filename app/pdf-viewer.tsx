import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Pdf from "react-native-pdf";

export default function PdfViewer() {
  const { uri, name } = useLocalSearchParams<{ uri: string; name: string }>();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* عارض PDF */}
      <Pdf
        source={{ uri }}
        style={{ flex: 1 }}
        onError={(err) => console.log("PDF error:", err)}
      />
    </View>
  );
}

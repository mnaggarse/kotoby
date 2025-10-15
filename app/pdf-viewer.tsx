import { useLocalSearchParams } from "expo-router";
import Pdf from "react-native-pdf";

export default function PdfViewer() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  return <Pdf source={{ uri }} style={{ flex: 1 }} />;
}

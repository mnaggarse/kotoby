import { addBooks } from "@/database/books";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as DocumentPicker from "expo-document-picker";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import PdfPageImage from "react-native-pdf-page-image";

type Props = {
  onBooksAdded: () => void;
};

export default function HomeHeaderButtons({ onBooksAdded }: Props) {
  const handleSelectFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      multiple: true,
    });

    if (result.canceled) return;

    const selectedFiles = await Promise.all(
      result.assets.map(async (file) => ({
        uri: file.uri,
        name: file.name,
        cover: (await PdfPageImage.generate(file.uri, 0, 1)).uri,
        pageCount: (await PdfPageImage.open(file.uri)).pageCount,
        currentPage: 0,
      }))
    );

    await addBooks(selectedFiles);
    onBooksAdded();
  };

  return (
    <View style={styles.headerButtonsContainer}>
      <TouchableOpacity onPress={handleSelectFiles}>
        <FontAwesome6 name="plus" size={22} color="black" />
      </TouchableOpacity>

      <TouchableOpacity>
        <FontAwesome6 name="gear" size={18} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
});

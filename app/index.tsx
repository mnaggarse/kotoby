import AddBookButton from "@/components/AddBookButton";
import BookOptionsBottomSheet from "@/components/BookOptionsBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ScrollView, Text, View } from "react-native";
import BookCard from "../components/BookCard";

type PdfFile = {
  name: string;
  uri: string;
  pages?: number;
};

export default function Index() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  // Bottom Sheet state
  const [selectedBook, setSelectedBook] = useState<PdfFile | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("pdf_files");
        const parsed = JSON.parse(stored || "[]");
        setPdfs(parsed);
      } catch (err) {
        console.error("Error loading saved files:", err);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("pdf_files", JSON.stringify(pdfs));
  }, [pdfs]);

  const handleSelectFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });

      if (result.canceled) return;

      const newFiles = result.assets.map((f) => ({
        name: f.name,
        uri: f.uri,
      }));

      setPdfs((prev) => [...prev, ...newFiles]);
    } catch (err) {
      console.error("Error selecting file:", err);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <AddBookButton onPress={handleSelectFile} />,
    });
  }, [navigation, handleSelectFile]);

  const handleOpenOptions = (book: PdfFile) => {
    setSelectedBook(book);
    bottomSheetRef.current?.expand();
  };

  const handleDeleteBook = () => {
    if (selectedBook) {
      setPdfs((prevPdfs) => {
        return prevPdfs.filter((pdf) => pdf.uri !== selectedBook.uri);
      });
    }
    bottomSheetRef.current?.close();
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
      }}
    >
      {pdfs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
          No books added yet. Press the '+' icon to add your first book.
        </Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {pdfs.map((file, i) => (
            <BookCard
              key={i}
              uri={file.uri}
              name={file.name}
              onPress={() =>
                router.push({
                  pathname: "/pdf-viewer",
                  params: { uri: file.uri, name: file.name },
                })
              }
              onOpenOptions={() => handleOpenOptions(file)}
            />
          ))}
        </ScrollView>
      )}

      <BookOptionsBottomSheet
        ref={bottomSheetRef}
        book={selectedBook}
        onClose={() => bottomSheetRef.current?.close()}
        onDelete={handleDeleteBook}
      />
    </View>
  );
}

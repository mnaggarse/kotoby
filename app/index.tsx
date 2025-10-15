import AddBookButton from "@/components/AddBookButton";
import BookOptionsBottomSheet from "@/components/BookOptionsBottomSheet";
import { addBooks, deleteBook, getAllBooks, updatePages } from "@/database/books";
import { PdfFile } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Pdf from "react-native-pdf";
import BookCard from "../components/BookCard";

export default function Index() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [processingFile, setProcessingFile] = useState<PdfFile | null>(null);
  const router = useRouter();
  const navigation = useNavigation();

  const [selectedBook, setSelectedBook] = useState<PdfFile | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // تحميل الكتب من قاعدة البيانات عند التركيز
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const storedBooks = await getAllBooks();
        setPdfs(storedBooks);
      })();
    }, [])
  );

  // اختيار كتب جديدة
  const handleSelectFile = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      multiple: true,
    });

    if (result.canceled) return;

    const newFiles = result.assets.map((f) => ({
      name: f.name,
      uri: f.uri,
    }));

    await addBooks(newFiles);
    const updated = await getAllBooks();
    setPdfs(updated);

    const fileToProcess = newFiles.find((f) => !f.pages);
    setProcessingFile(fileToProcess || null);
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

  const handleDeleteBook = async () => {
    if (selectedBook) {
      await deleteBook(selectedBook.uri);
      const updated = await getAllBooks();
      setPdfs(updated);
    }
    bottomSheetRef.current?.close();
  };

  const handleUpdatePageCount = async (uri: string, pages: number) => {
    await updatePages(uri, pages);
    const updated = await getAllBooks();
    setPdfs(updated);
  };

  return (
    <View style={styles.container}>
      {processingFile && (
        <Pdf
          source={{ uri: processingFile.uri }}
          onLoadComplete={(numberOfPages) =>
            handleUpdatePageCount(processingFile.uri, numberOfPages)
          }
          style={styles.hiddenPdf}
        />
      )}

      {pdfs.length === 0 ? (
        <Text style={styles.emptyText}>
          No books added yet. Press the '+' icon to add your first book.
        </Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {pdfs.map((file) => (
            <BookCard
              key={file.uri}
              uri={file.uri}
              name={file.name}
              pages={file.pages}
              currentPage={file.currentPage}
              onPress={() =>
                router.push({
                  pathname: "/pdf-viewer",
                  params: {
                    uri: file.uri,
                    name: file.name,
                    currentPage: file.currentPage,
                  },
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6c757d",
  },
  hiddenPdf: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});

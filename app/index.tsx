import BookOptionsBottomSheet from "@/components/BookOptionsBottomSheet";
import { addBooks, deleteBook, getAllBooks } from "@/database/books";
import { Book } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PdfPageImage from "react-native-pdf-page-image";
import BookCard from "../components/BookCard";

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const loadBooks = useCallback(async () => {
    const result = await getAllBooks();
    setBooks(result);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadBooks();
    }
  }, [isFocused, loadBooks]);

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
    await loadBooks();
  };

  const handleLongPress = (book: Book) => {
    setSelectedBook(book);
    bottomSheetRef.current?.expand();
  };

  const handleDeleteBook = async () => {
    if (selectedBook) {
      await deleteBook(selectedBook.uri);
      await loadBooks();
    }
    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <Text style={styles.emptyText}>
          No books added yet. Press the '+' icon to add your first book.
        </Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.bookList}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPress={() =>
                router.push({
                  pathname: "/pdf-viewer",
                  params: {
                    uri: book.uri,
                    name: book.name,
                    currentPage: book.currentPage,
                  },
                })
              }
              onOpenOptions={() => handleLongPress(book)}
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
    paddingTop: 32,
    paddingHorizontal: 8,
    backgroundColor: "#f8f9fa",
  },
  bookList: {
    paddingBottom: 16,
    gap: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6c757d",
  },
});

import BookOptionsBottomSheet from "@/components/BookOptionsBottomSheet";
import HomeHeaderButtons from "@/components/HomeHeaderButtons";
import { deleteBook, getAllBooks } from "@/database/books";
import { Book } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import MasonryList from "@react-native-seoul/masonry-list";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BookCard from "../components/BookCard";

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadBooks = useCallback(async () => {
    const result = await getAllBooks();
    setBooks(result);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadBooks();
    }
  }, [isFocused, loadBooks]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HomeHeaderButtons onBooksAdded={loadBooks} />,
    });
  }, [navigation, loadBooks]);

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
        <View style={styles.emptyTextContainer}>
          <Text style={styles.emptyText}>لا توجد كتب بعد</Text>
          <Text style={styles.emptyText}>اضغط على زر '+' لإضافة كتب.</Text>
        </View>
      ) : (
        <MasonryList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() =>
                router.push({
                  pathname: "/pdf-viewer",
                  params: { uri: item.uri, name: item.name, currentPage: item.currentPage },
                })
              }
              onOpenOptions={() => handleLongPress(item)}
            />
          )}
          style={styles.bookList}
          showsVerticalScrollIndicator={false}
        />
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
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: "#f8f9fa",
  },
  bookList: {
    paddingHorizontal: 4,
    paddingBottom: 8,
    gap: 8,
  },
  emptyTextContainer: {
    marginTop: 300,
    maxWidth: "80%",
    marginHorizontal: "auto",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "ibm-medium",
    color: "#6c757d",
  },
});

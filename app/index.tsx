import BookOptionsBottomSheet from "@/components/BookOptionsBottomSheet";
import HomeHeaderButtons from "@/components/HomeHeaderButtons";
import { deleteBook, getAllBooks } from "@/database/books";
import { Book } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BookCard from "../components/BookCard";

type BookSectionProps = {
  title: string;
  books: Book[];
  onBookPress: (book: Book) => void;
  onBookLongPress: (book: Book) => void;
};

export default function Index() {
  const [readingBooks, setReadingBooks] = useState<Book[]>([]);
  const [toReadBooks, setToReadBooks] = useState<Book[]>([]);
  const [completedBooks, setCompletedBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadBooks = useCallback(async () => {
    const result = await getAllBooks();
    setReadingBooks(result.filter((b) => b.currentPage > 0 && b.currentPage < b.pageCount));
    setToReadBooks(result.filter((b) => b.currentPage === 0));
    setCompletedBooks(result.filter((b) => b.currentPage > 0 && b.currentPage === b.pageCount));
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

  const handleBookPress = (book: Book) => {
    router.push({
      pathname: "/pdf-viewer",
      params: { uri: book.uri, name: book.name, currentPage: book.currentPage },
    });
  };

  const BookSection = ({ title, books, onBookPress, onBookLongPress }: BookSectionProps) => {
    if (books.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.bookList}>
          {books.map((item) => (
            <View key={item.id} style={styles.bookCardWrapper}>
              <BookCard
                book={item}
                onPress={() => onBookPress(item)}
                onOpenOptions={() => onBookLongPress(item)}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const hasBooks = readingBooks.length > 0 || toReadBooks.length > 0 || completedBooks.length > 0;

  return (
    <View style={styles.container}>
      {!hasBooks ? (
        <View style={styles.emptyTextContainer}>
          <Text style={styles.emptyText}>لا توجد كتب بعد</Text>
          <Text style={styles.emptyText}>اضغط على زر '+' لإضافة كتب.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <BookSection
            title="تقرأ حاليًا"
            books={readingBooks}
            onBookPress={handleBookPress}
            onBookLongPress={handleLongPress}
          />
          <BookSection
            title="لم تبدأ بعد"
            books={toReadBooks}
            onBookPress={handleBookPress}
            onBookLongPress={handleLongPress}
          />
          <BookSection
            title="مكتملة"
            books={completedBooks}
            onBookPress={handleBookPress}
            onBookLongPress={handleLongPress}
          />
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
    backgroundColor: "#f8f9fa",
  },
  sectionContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "ibm-bold",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 16,
  },
  bookList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4, // Counteract the card margin
  },
  bookCardWrapper: {
    width: "33.33%", // for 3 columns
    paddingHorizontal: 4,
    paddingBottom: 8,
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

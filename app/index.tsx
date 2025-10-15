import AddBookButton from "@/components/AddBookButton";
import BookOptionsBottomSheet from "@/components/BookOptionsBottomSheet";
import { PdfFile } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Pdf from "react-native-pdf";
import BookCard from "../components/BookCard";

export default function Index() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [processingFile, setProcessingFile] = useState<PdfFile | null>(null);
  const router = useRouter();
  const navigation = useNavigation();

  // Bottom Sheet state
  const [selectedBook, setSelectedBook] = useState<PdfFile | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useFocusEffect(
    useCallback(() => {
      const loadPdfs = async () => {
        try {
          const stored = await AsyncStorage.getItem("pdf_files");
          setPdfs(JSON.parse(stored || "[]"));
        } catch (err) {
          console.error("Error loading saved files:", err);
        }
      };
      loadPdfs();
    }, [])
  );

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

      setPdfs((currentPdfs) => {
        const existingUris = new Set(currentPdfs.map((p) => p.uri));
        const newFiles = result.assets
          .filter((f) => !existingUris.has(f.uri))
          .map((f) => ({
            name: f.name,
            uri: f.uri,
          }));

        if (newFiles.length === 0) {
          return currentPdfs; // No new files were added
        }

        const updatedPdfs = [...currentPdfs, ...newFiles];
        const fileToProcess = updatedPdfs.find((pdf) => !pdf.pages);
        setProcessingFile(fileToProcess || null);
        return updatedPdfs;
      });
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

  const handleUpdatePageCount = (uri: string, pages: number) => {
    let nextFileToProcess: PdfFile | undefined;
    const updatedPdfs = pdfs.map((pdf) => {
      if (pdf.uri === uri && pdf.pages !== pages) {
        return { ...pdf, pages };
      }
      // While we're iterating, find the next file that needs processing
      if (pdf.uri !== uri && !pdf.pages) {
        nextFileToProcess = pdf;
      }
      return pdf;
    });
    setPdfs(updatedPdfs);
    setProcessingFile(nextFileToProcess || null);
  };

  return (
    <View style={styles.container}>
      {/* Hidden PDF component for processing page counts in the background */}
      {processingFile && (
        <Pdf
          source={{ uri: processingFile.uri }}
          onLoadComplete={(numberOfPages) => {
            handleUpdatePageCount(processingFile.uri, numberOfPages);
          }}
          style={styles.hiddenPdf}
        />
      )}

      {pdfs.length === 0 ? (
        <Text style={styles.emptyText}>
          No books added yet. Press the '+' icon to add your first book.
        </Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {pdfs.map((file, i) => (
            <BookCard
              key={i}
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

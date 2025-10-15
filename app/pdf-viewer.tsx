import { PdfFile } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default function PdfViewer() {
  const { uri, name, currentPage } = useLocalSearchParams<{
    uri: string;
    name: string;
    currentPage?: string;
  }>();
  const navigation = useNavigation();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  const saveCurrentPage = async (page: number) => {
    try {
      const stored = await AsyncStorage.getItem("pdf_files");
      const pdfs: PdfFile[] = JSON.parse(stored || "[]");

      const updatedPdfs = pdfs.map((pdf) =>
        pdf.uri === uri ? { ...pdf, currentPage: page } : pdf
      );

      await AsyncStorage.setItem("pdf_files", JSON.stringify(updatedPdfs));
    } catch (error) {
      console.error("Failed to save current page", error);
    }
  };

  const handlePageChanged = (page: number) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      saveCurrentPage(page);
    }, 500); // Save after 500ms of inactivity
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  if (!uri) return null;

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        page={currentPage ? parseInt(currentPage, 10) : 1}
        onPageChanged={handlePageChanged}
        style={styles.pdf}
      />
    </View>
  );
}

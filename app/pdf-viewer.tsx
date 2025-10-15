import { updateCurrentPage } from "@/database/books";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";

export default function PdfViewer() {
  const { uri, name, currentPage } = useLocalSearchParams<{
    uri: string;
    name: string;
    currentPage?: string;
  }>();
  const navigation = useNavigation();
  const debounceTimer = useRef<number>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ title: name, headerShown: isHeaderVisible });
  }, [navigation, name, isHeaderVisible]);

  // Toggles the header visibility on single tap
  const handleSingleTap = () => {
    setIsHeaderVisible((prev) => !prev);
  };

  const handlePageChanged = (page: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateCurrentPage(uri, page);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  if (!uri) return null;

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        page={currentPage ? parseInt(currentPage, 10) : 1}
        onPageChanged={handlePageChanged}
        onPageSingleTap={handleSingleTap}
        style={styles.pdf}
        maxScale={4}
        spacing={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

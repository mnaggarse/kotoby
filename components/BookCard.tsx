import { Book } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  book: Book;
  onPress?: () => void;
  onOpenOptions: () => void;
};

export default function BookCard({ book, onPress, onOpenOptions }: Props) {
  const progress = (book.currentPage / book.pageCount) * 100;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onOpenOptions}
      activeOpacity={0.6}
    >
      <Image source={{ uri: book.cover }} style={styles.cover} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text numberOfLines={3} style={styles.title}>
          {book.name}
        </Text>
        <View>
          <View style={styles.pagesContainer}>
            <Text style={styles.pages}>
              {book.currentPage} من {book.pageCount} صفحة
            </Text>
            <Text style={styles.pages}>{progress.toFixed(1)}%</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 8,
    width: "100%",
    borderWidth: 1,
    paddingRight: 10,
    borderRadius: 16,
    borderBottomWidth: 3,
    borderColor: "lightgray",
    backgroundColor: "white",
    flexDirection: "row",
  },
  cover: {
    width: 80,
    height: 110,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "lightgray",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: "ibm-medium",
  },
  pagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pages: {
    fontSize: 14,
    color: "#6c757d",
    fontFamily: "ibm-regular",
  },
  progressBarContainer: {
    height: 12,
    width: "100%",
    backgroundColor: "#e9ecef",
    borderRadius: 100,
    marginTop: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#007bff",
  },
});

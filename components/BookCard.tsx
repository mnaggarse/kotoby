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
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={onOpenOptions}>
      <Image source={{ uri: book.cover }} style={styles.cover} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text numberOfLines={3} style={styles.title}>
          {book.name}
        </Text>
        <View>
          <Text style={styles.pages}>{book.pageCount} pages</Text>
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
    padding: 8,
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: "lightgray",
    backgroundColor: "white",
    flexDirection: "row",
    gap: 8,
  },
  cover: {
    width: 90,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    flexShrink: 1,
  },
  pages: {
    fontSize: 12,
    color: "#6c757d",
  },
  progressBarContainer: {
    height: 10,
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

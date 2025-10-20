import { Book } from "@/types";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  book: Book;
  onPress?: () => void;
  onOpenOptions: () => void;
};

export default function BookCard({ book, onPress, onOpenOptions }: Props) {
  const progress = Math.floor((book.currentPage / book.pageCount) * 100);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onOpenOptions}
      activeOpacity={0.6}
    >
      <Image source={{ uri: book.cover }} style={styles.cover} contentFit="cover" />
      <View style={styles.infoContainer}>
        {/* <Text numberOfLines={3} style={styles.title}>
          {book.name}
        </Text> */}
        <View>
          <View style={styles.pagesContainer}>
            <Text style={styles.pages}>
              {book.pageCount}/{book.currentPage}
            </Text>
            <Text style={styles.pages}>{progress}%</Text>
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
    padding: 8,
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    borderBottomWidth: 3,
    borderColor: "lightgray",
    backgroundColor: "white",
    flexDirection: "column",
    gap: 8,
  },
  cover: {
    width: "100%",
    borderWidth: 1,
    aspectRatio: 4 / 6,
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "lightgray",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "ibm-medium",
    textAlign: "center",
  },
  pagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pages: {
    fontSize: 12,
    color: "#6c757d",
    fontFamily: "ibm-regular",
  },
  progressBarContainer: {
    height: 12,
    width: "100%",
    backgroundColor: "#e9ecef",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#007bff",
  },
});

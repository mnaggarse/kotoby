import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Pdf from "react-native-pdf";

type Props = {
  uri: string;
  name: string;
  pages?: number;
  currentPage?: number;
  onPress?: () => void;
  onOpenOptions: () => void;
};

export default function BookCard({
  uri,
  name,
  pages,
  currentPage,
  onPress,
  onOpenOptions,
}: Props) {
  const progress = pages && currentPage ? (currentPage / pages) * 100 : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onOpenOptions}
    >
      <Pdf source={{ uri }} page={1} singlePage={true} style={styles.cover} />
      <View style={styles.infoContainer}>
        <Text numberOfLines={3} style={styles.title}>
          {name}
        </Text>
        <View>
          {pages && <Text style={styles.pages}>{pages} pages</Text>}
          {progress > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          )}
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
    marginBottom: 8,
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
    height: 6,
    width: "100%",
    backgroundColor: "#e9ecef",
    borderRadius: 3,
    marginTop: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007bff",
  },
});

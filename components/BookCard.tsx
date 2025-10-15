import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Pdf from "react-native-pdf";

type Props = {
  uri: string;
  name: string;
  onPress?: () => void;
  onOpenOptions: () => void;
};

export default function BookCard({ uri, name, onPress, onOpenOptions }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onOpenOptions}
    >
      <Pdf source={{ uri }} page={1} singlePage={true} style={styles.cover} />
      <Text numberOfLines={3} style={styles.title}>
        {name}
      </Text>
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
  title: {
    fontSize: 16,
  },
});

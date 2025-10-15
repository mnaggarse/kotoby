import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function AddBookButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FontAwesome6 name="add" size={20} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
});

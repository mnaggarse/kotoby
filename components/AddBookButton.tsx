import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { TouchableOpacity } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function AddBookButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 16 }}>
      <FontAwesome6 name="add" size={20} color="black" />
    </TouchableOpacity>
  );
}

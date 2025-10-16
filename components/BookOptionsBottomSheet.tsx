import { Book } from "@/types";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  book?: Book;
  onDelete: () => void;
  onClose: () => void;
};

const BookOptionsBottomSheet = forwardRef<BottomSheet, Props>(
  ({ book, onDelete, onClose }, ref) => {
    const snapPoints = useMemo(() => ["30%"], []);

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop opacity={0.1} {...props} disappearsOnIndex={-1} />,
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>{book?.name || "Book Options"}</Text>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <Text style={styles.buttonText}>حذف الكتاب</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>إلغاء</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default BookOptionsBottomSheet;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "sf",
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#6c757d",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "sf",
  },
});

import { addBooks, deleteAllBooks, getAllBooks } from "@/database/books";
import { Book } from "@/types";
import { FontAwesome6 } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const handleExportData = async () => {
    try {
      const books = await getAllBooks();
      const data = JSON.stringify(books, null, 2);
      const file = new File(Paths.document, "kotoby_backup.json");
      await file.create({ overwrite: true });
      file.write(data);
      await Sharing.shareAsync(file.uri);
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert("خطأ", "فشل تصدير البيانات.");
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (result.canceled) {
        return;
      }

      const file = new File(result.assets[0].uri);
      const content = await file.text();
      const booksToImport: Book[] = JSON.parse(content);

      Alert.alert(
        "استيراد البيانات",
        "سيؤدي هذا إلى حذف جميع بياناتك الحالية واستبدالها بالبيانات الموجودة في الملف الذي اخترته. هل أنت متأكد؟",
        [
          { text: "إلغاء" },
          {
            text: "استيراد",
            onPress: async () => {
              try {
                await deleteAllBooks();
                await addBooks(booksToImport);
                Alert.alert("نجاح", "تم استيراد البيانات بنجاح.", [
                  { text: "حسنًا", onPress: () => router.back() },
                ]);
              } catch (e) {
                Alert.alert("خطأ", "فشل استيراد البيانات.");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Import failed:", error);
      Alert.alert("خطأ", "فشل استيراد البيانات.");
    }
  };

  const handleResetData = () => {
    Alert.alert(
      "إعادة تعيين البيانات",
      "هل أنت متأكد من رغبتك في حذف جميع بياناتك؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        { text: "إلغاء" },
        {
          text: "إعادة تعيين",
          onPress: () => deleteAllBooks().then(() => router.back()),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Data Management Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>إدارة البيانات</Text>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleExportData}>
          <FontAwesome6 name="arrow-up-from-bracket" size={16} color="white" />
          <Text style={styles.buttonText}>تصدير البيانات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleImportData}>
          <FontAwesome6 name="file-import" size={16} color="white" />
          <Text style={styles.buttonText}>استيراد البيانات</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>الحساب</Text>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleResetData}>
          <FontAwesome6 name="trash-can" size={16} color="white" />
          <Text style={styles.buttonText}>إعادة تعيين البيانات</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "white",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
    borderWidth: Platform.OS === "android" ? 1 : 0,
    borderColor: Platform.OS === "android" ? "#f0f0f0" : "transparent",
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "ibm-bold",
  },
  settingRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingText: {
    fontSize: 16,
    fontFamily: "ibm-regular",
  },
  settingValue: {
    fontSize: 16,
    fontFamily: "ibm-regular",
    color: "#6c757d",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#007bff",
  },
  dangerButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "ibm-medium",
  },
});

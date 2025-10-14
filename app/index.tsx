import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

type PDFFile = {
  name: string;
  uri: string;
  pages?: number;
};

export default function Index() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const router = useRouter();

  // ✅ تحميل الملفات المحفوظة عند فتح التطبيق
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("pdf_files");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setFiles(parsed);
        }
      } catch (err) {
        console.error("Error loading saved files:", err);
      }
    })();
  }, []);

  // ✅ حفظ الملفات تلقائيًا عند أي تعديل
  useEffect(() => {
    AsyncStorage.setItem("pdf_files", JSON.stringify(files));
  }, [files]);

  // ✅ اختيار ملف جديد
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });

      if (result.canceled) return;

      const newFiles = result.assets.map((f) => ({
        name: f.name,
        uri: f.uri,
      }));

      // ✅ دمج الملفات الجديدة مع القديمة بدون تكرار
      setFiles((prev) => {
        const all = [...prev];
        for (const file of newFiles) {
          if (!all.find((f) => f.uri === file.uri)) all.push(file);
        }
        return all;
      });
    } catch (err) {
      console.error("Error selecting file:", err);
      Alert.alert("Error selecting file");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f8f9fa" }}>
      {/* زر اختيار الملفات */}
      <TouchableOpacity
        onPress={handleSelectFile}
        style={{
          backgroundColor: "#007bff",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Select PDF Files
        </Text>
      </TouchableOpacity>

      {/* عرض الملفات */}
      {files.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#666" }}>
          No files added yet.
        </Text>
      ) : (
        <ScrollView>
          {files.map((file, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                router.push({
                  pathname: "/pdf-viewer",
                  params: {
                    uri: file.uri,
                    name: file.name,
                  },
                })
              }
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text style={{ fontSize: 16 }}>📄 {file.name}</Text>
              {file.pages && (
                <Text style={{ color: "gray" }}>Pages: {file.pages}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

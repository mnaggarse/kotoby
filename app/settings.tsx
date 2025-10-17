import { deleteAllBooks } from "@/database/books";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleExportData = () => {
    // TODO: Implement export functionality
    Alert.alert("تصدير البيانات", "سيتم تنفيذ هذه الميزة قريبًا.");
  };

  const handleImportData = () => {
    // TODO: Implement import functionality
    Alert.alert("استيراد البيانات", "سيتم تنفيذ هذه الميزة قريبًا.");
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

  const handleChooseTime = () => {
    // TODO: Implement time picker
    Alert.alert("وقت الإشعارات", "سيتم تنفيذ هذه الميزة قريبًا.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Notifications Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>الإشعارات</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>تفعيل الإشعارات</Text>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
        <TouchableOpacity style={styles.settingRow} onPress={handleChooseTime}>
          <Text style={styles.settingText}>وقت الإشعار</Text>
          <Text style={styles.settingValue}>10:00 صباحًا</Text>
        </TouchableOpacity>
      </View>

      {/* Data Management Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>إدارة البيانات</Text>
        <TouchableOpacity style={styles.button} onPress={handleExportData}>
          <Text style={styles.buttonText}>تصدير البيانات</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleImportData}>
          <Text style={styles.buttonText}>استيراد البيانات</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>الحساب</Text>
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleResetData}>
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
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "white",
    borderColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 12,
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
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
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

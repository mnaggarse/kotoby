// import { updateCurrentPage } from "@/database/books";
// import { useLocalSearchParams, useNavigation } from "expo-router";
// import React, { useEffect, useLayoutEffect, useRef } from "react";
// import { Dimensions, StyleSheet, View } from "react-native";
// import Pdf from "react-native-pdf";

// export default function PdfViewer() {
//   const { uri, name, currentPage } = useLocalSearchParams<{
//     uri: string;
//     name: string;
//     currentPage?: string;
//   }>();
//   const navigation = useNavigation();
//   const debounceTimer = useRef<number>(null);

//   useLayoutEffect(() => {
//     navigation.setOptions({ title: name });
//   }, [navigation, name]);

//   const handlePageChanged = (page: number) => {
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     debounceTimer.current = setTimeout(() => {
//       updateCurrentPage(uri, page);
//     }, 0);
//   };

//   useEffect(() => {
//     return () => {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     };
//   }, []);

//   if (!uri) return null;

//   return (
//     <View style={styles.container}>
//       <Pdf
//         source={{ uri }}
//         page={currentPage ? parseInt(currentPage, 10) : 1}
//         onPageChanged={handlePageChanged}
//         style={styles.pdf}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
// });

import { updateCurrentPage } from "@/database/books";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default function PdfViewer() {
  const { uri, name, currentPage } = useLocalSearchParams<{
    uri: string;
    name: string;
    currentPage?: string;
  }>();
  const navigation = useNavigation();
  const debounceTimer = useRef<number>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  const handlePageChanged = (page: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateCurrentPage(uri, page);
    }, 0);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  if (!uri) return null;

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        page={currentPage ? parseInt(currentPage, 10) : 1}
        onPageChanged={handlePageChanged}
        style={styles.pdf}
      />
    </View>
  );
}

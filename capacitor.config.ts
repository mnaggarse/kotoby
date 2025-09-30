import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mnaggarse.kotoby",
  appName: "كتبي",
  webDir: "dist",
  server: {
    url: "http://192.168.1.10:5173",
    cleartext: true,
  },
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false,
    },
  },
};

export default config;

import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); //Yönlendirme İçin

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error) {
      alert("Giriş Hatası: " + error);
    }
  }

  async function handleSignUp() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Hesap Başarıyla oluşturuldu");
    } catch (error) {
      alert("Kayıt Hatası" + error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Hoş Geldin</Text>
        <Text style={styles.subTitle}>Devam etmek için giriş yap</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.emailSifre}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.emailSifre}
          placeholder="Sfire"
          onChangeText={setPassword}
          value={password}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => handleLogin}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            Giriş Yap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => handleSignUp}
        >
          <Text style={{ color: "#4A90E2", fontSize: 16, fontWeight: "600" }}>
            Hesap Oluştur
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginTop: 80,
    width: "90%",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D3436",
  },
  subTitle: {
    fontSize: 16,
    color: "#636E72",
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 40,
  },
  emailSifre: {
    height: 55,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
  },
  buttonContainer: {
    flexDirection: "column",
  },
  primaryButton: {
    backgroundColor: "#4A90E2",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    marginTop: 15,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#4A90E2",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

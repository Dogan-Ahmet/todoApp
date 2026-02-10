import Ionicons from "@expo/vector-icons/Ionicons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore"; // Firestore işlemleri için gerekli fonksiyonları ekledik
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebaseConfig"; // Firestore bağlantısını içe aktarıyoruz

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskList, setTaskList] = useState<
    { id: string; task: string; completed: boolean }[]
  >([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        // Firestore'dan görevleri alalım
        const querySnapshot = await getDocs(collection(db, "tasks"));

        // Firestore'dan gelen verileri uygun formata dönüştürelim
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          task: doc.data().task,
          completed: doc.data().completed,
        }));
        // State'i Firestore'dan gelen verilerle güncelleyelim
        setTaskList(tasksData);
      } catch (error) {
        console.error("Hata:", error);
      }
    }
    fetchTasks();
  }, []);

  async function taskAddHandler() {
    if (searchQuery.trim() === "") {
      return;
    }
    setTaskList((prevList) => [
      ...prevList,
      { id: Date.now().toString(), task: searchQuery.trim(), completed: false },
    ]);
    const taskToSave = searchQuery.trim();
    setSearchQuery("");

    try {
      // Firestore'a yeni bir görev ekleyelim
      await addDoc(collection(db, "tasks"), {
        task: taskToSave,
        completed: false,
        createdAt: new Date(),
      });
      console.log("Task added to Firestore: ", taskToSave);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async function taskCompleteHandler(id: string, currentStatus: boolean) {
    setTaskList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
    try {
      // Firestore'da ilgili görevin tamamlanma durumunu güncelleyelim
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !currentStatus });
      console.log("Task updated in Firestore: ", id);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async function taskDeleteHandler(id: string) {
    setTaskList((prevList) => prevList.filter((item) => item.id !== id));

    try {
      // Firestore'dan ilgili görevi silelim
      // Firestore'da belgeler ID'ye göre silindiği için doc() fonksiyonunu kullanarak belge referansı oluşturuyoruz
      const taskRef = doc(db, "tasks", id);
      await deleteDoc(taskRef);
      console.log("Task deleted from Firestore: ", id);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  async function clearAllTasks() {
    if (taskList.length === 0) return;
    setTaskList([]);
    try {
      // Firestore'daki tüm görevleri silelim
      const deletePromises = taskList.map((item) => {
        const taskRed = doc(db, "tasks", item.id);
        return deleteDoc(taskRed);
      });
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing all tasks: ", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor="goldenrod"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => taskAddHandler()}
        >
          <Text style={styles.buttonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 50,
          paddingBottom: 70,
        }}
      >
        {taskList.map((item) => (
          <View key={item.id} style={styles.taskCard}>
            <Text
              style={
                item.completed
                  ? styles.taskCardTextCompleted
                  : styles.taskCardText
              }
            >
              {item.task.toLowerCase()}
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity onPress={() => taskDeleteHandler(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#570707" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => taskCompleteHandler(item.id, item.completed)}
              >
                <Ionicons name="checkbox-outline" size={24} color="#106e1d" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.footerCard}
          onPress={() => {
            clearAllTasks();
          }}
        >
          <Ionicons name="trash-bin-outline" size={24} color="#570707" />
          <Text style={{ color: "#570707", fontSize: 25 }}>Tümünü Temizle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerCard}
          onPress={() =>
            setTaskList((prevList) =>
              prevList.map((item) => ({ ...item, completed: true })),
            )
          }
        >
          <Ionicons name="checkmark-done-outline" size={24} color="#106e1d" />
          <Text style={{ color: "#106e1d", fontSize: 25 }}>Tümünü Tamamla</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#0a1224",
  },
  card: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "goldenrod",
    width: "90%",
  },
  taskCard: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "goldenrod",
    borderRadius: 10,
    width: "90%",
    padding: 10,
  },
  taskCardText: {
    color: "#ddd",
    fontSize: 21,
    width: "80%",
  },
  taskCardTextCompleted: {
    color: "#ddd",
    fontSize: 21,
    width: "80%",
    textDecorationLine: "line-through",
  },
  footerCard: {
    width: "90%",
    color: "#ddd",
    fontSize: 21,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    backgroundColor: "#043006",
    padding: 10,
    borderRadius: 15,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    width: "20%",
    gap: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchInput: {
    width: "80%",
    color: "white",
    // height: 40,
  },
});

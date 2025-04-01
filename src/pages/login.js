import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    const user = await AsyncStorage.getItem("user");
    if (!user) {
      alert("Nenhum usuário cadastrado!");
      return;
    }
    const userJson = JSON.parse(user);
    if (userJson.email === email && userJson.password === password) {
      navigation.navigate("Main");
    } else {
      alert("E-mail ou senha inválidos!");
    }
  };

  const handleCadastro = () => {
    navigation.navigate("Cadastro");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>
      
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#ffff"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#fff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#ffff"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>CRIAR CONTA</Text>
      </TouchableOpacity>
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000020",
      paddingHorizontal: 20,
    },
    title: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 40,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      width: "80%",
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: "#fff",
      padding: 10,
      paddingLeft: 40,
      marginVertical: 10,
      width: "100%",
      color: "#fff",
      fontSize: 16,
    },
    icon: {
      position: "absolute",
      left: 10,
      zIndex: 1,
    },
    button: {
      borderWidth: 1,
      borderColor: "#fff",
      backgroundColor: "transparent",
      borderRadius: 25,
      padding: 10,
      width: "40%",
      alignItems: "center",
      marginVertical: 10,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
});

export default Login;
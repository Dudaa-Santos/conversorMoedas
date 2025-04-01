import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Cadastro extends Component {
  state = {
    email: "",
    password: "",
  };

  handleCadastro = async () => {
    const { email, password } = this.state;
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }
    const user = {
      email,
      password,
    };
    await AsyncStorage.setItem("user", JSON.stringify(user));
    alert("Usuário cadastrado com sucesso!");
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CADASTRO</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#ffff"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#ffff"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handleCadastro}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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
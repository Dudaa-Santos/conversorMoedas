import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import api from '../service/api';
import { MaterialIcons } from '@expo/vector-icons';
import CountryFlag from 'react-native-country-flag';

const Main = () => {
  // estados do componente
  const [value, setValue] = useState(''); // valor a ser convertido
  const [fromCurrency, setFromCurrency] = useState(''); // origem
  const [toCurrency, setToCurrency] = useState(''); // destino
  const [currencies, setCurrencies] = useState([]); // lista completa de moedas
  const [filteredCurrencies, setFilteredCurrencies] = useState([]); // lista filtrada de moedas (para busca)
  const [search, setSearch] = useState(''); // busca para filtrar moedas
  const [result, setResult] = useState(null); // resultado
  const [loading, setLoading] = useState(false); // loading
  const [isPickerVisible, setIsPickerVisible] = useState(false); // modal de seleção de moeda
  const [activePicker, setActivePicker] = useState(null); // qual seletor está ativo ('from' ou 'to')

  // limpar todos os campos
  const clearFields = () => {
    setValue('');
    setFromCurrency('');
    setToCurrency('');
    setResult(null);
    setSearch('');
    setFilteredCurrencies(currencies);
  };

  // filtrar moedas baseado no texto da pesquisa
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = currencies.filter(([code, name]) =>
      name?.toLowerCase().includes(text.toLowerCase()) ||
      code?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCurrencies(filtered);
  };

  // efeito loading
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await api.get('/codes');
        setCurrencies(response.data.supported_codes);
        setFilteredCurrencies(response.data.supported_codes);
      } catch (error) {
        console.error('Erro ao carregar moedas:', error);
      }
    };
    fetchCurrencies();
  }, []);

  const convert = async () => {
    if (!value) {
      alert('Insira um valor para conversão!');
      return;
    }

    try {
      Keyboard.dismiss(); 
      setLoading(true);
      // faz a requisição para a API de conversão
      const response = await api.get(`/latest/${fromCurrency}`);
      const rate = response.data.conversion_rates[toCurrency];

      if (!rate) {
        alert('Moeda inválida!');
        return;
      }

      // calcula o valor convertido
      const converted = (parseFloat(value) * rate).toFixed(2);

      // armazena o resultado
      setResult({ from: value, to: converted, rate });
    } catch (err) {
      console.error(err);
      alert('Erro ao converter moeda');
    } finally {
      setLoading(false);
    }
  };

  // função para trocar as moedas de origem e destino
  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null); // limpa o resultado anterior
  };

  // renderiza os itens da lista de moedas 
  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => {
        // define a moeda selecionada baseado no seletor ativo
        if (activePicker === 'from') {
          setFromCurrency(item[0] || '');
        } else {
          setToCurrency(item[0] || '');
        }
        // fecha o modal e limpa a busca
        setIsPickerVisible(false);
        setSearch('');
        setFilteredCurrencies(currencies);
      }}
    >
      {/* mostra a bandeira do país */}
      {item[0] && <CountryFlag isoCode={item[0].slice(0, 2)} size={18} />}
      {/* mostra o código e nome da moeda */}
      <Text style={styles.currencyItemText}>{`${item[0] || ''} - ${item[1] || ''}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CONVERSOR DE MOEDAS</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor"
        placeholderTextColor="#535353"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <View style={styles.row}>
        {/* moeda de origem */}
        <TouchableOpacity
          style={styles.currencyBox}
          onPress={() => {
            setActivePicker('from');
            setIsPickerVisible(true);
          }}
        >
          {fromCurrency && <CountryFlag isoCode={fromCurrency.slice(0, 2)} size={18} />}
          <Text style={[styles.selectedCurrencyText, !fromCurrency && { color: '#535353' }]}>
                {fromCurrency || 'Selecione'}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#535353" />
        </TouchableOpacity>

        {/* inverter moedas */}
        <TouchableOpacity style={styles.switchButton} onPress={switchCurrencies}>
          <MaterialIcons name="swap-horiz" size={24} color="#fff" />
        </TouchableOpacity>

        {/* moeda de destino */}
        <TouchableOpacity
          style={styles.currencyBox}
          onPress={() => {
            setActivePicker('to');
            setIsPickerVisible(true);
          }}
        >
          {toCurrency && <CountryFlag isoCode={toCurrency.slice(0, 2)} size={18} />}
          <Text style={[styles.selectedCurrencyText, !fromCurrency && { color: '#535353' }]}>
               {fromCurrency || 'Selecione'}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#535353" />
        </TouchableOpacity>
      </View>

      {/* Modal para selecionar moeda */}
      {isPickerVisible && (
        <Modal
          visible={isPickerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsPickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar moeda..."
                placeholderTextColor="#535353"
                value={search}
                onChangeText={handleSearch}
              />
              {/* lista de moedas filtradas */}
              <FlatList
                data={filteredCurrencies}
                renderItem={renderCurrencyItem}
                keyExtractor={(item) => item[0]}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsPickerVisible(false)}
              >
                <Text style={styles.closeButtonText}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* mostra o resultado */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : result && result.from && result.to && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {fromCurrency} {parseFloat(result.from).toLocaleString('pt-BR')} = {toCurrency} {parseFloat(result.to).toLocaleString('pt-BR')}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.convertButton} onPress={convert}>
        <Text style={styles.convertButtonText}>CONVERTER</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
        <Text style={styles.clearButtonText}>LIMPAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e1b',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '97%',
    backgroundColor: '#d9d9d9',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencyBox: {
    backgroundColor: '#d9d9d9',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    height: 50,
  },
  selectedCurrencyText: {
    color: '#000',
    fontSize: 16,
    marginHorizontal: 8,
    flex: 1,
  },
  switchButton: {
    backgroundColor: '#4b6cb7',
    padding: 10,
    borderRadius: 999,
  },
  resultBox: {
    backgroundColor: '#c62828',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  convertButton: {
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    width: "50%",
  },
  convertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#4b6cb7',
    borderRadius: 20,
    width: "40%",
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#d9d9d9',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  currencyItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  closeButton: {
    backgroundColor: '#4b6cb7',
    padding: 10,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Main;
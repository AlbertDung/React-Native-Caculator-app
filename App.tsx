import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import { Entypo, AntDesign, FontAwesome6, Feather, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('0'); 
  const [lastNumber, setLastNumber] = useState('');
  const [advancedKeyboard, setAdvancedKeyboard] = useState(false);

  const defaultButtons = [
    'C', 'DEL', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '@', '0', '.', '='
  ];

  const advancedButtons = [
    '2nd', 'deg', 'sin', 'cos', 'tan',
    '^y', 'lg', 'ln', '(', ')',
    '√x', 'C', 'DEL', '%', '/',
    'x!', '7', '8', '9', '*',
    '1/x', '4', '5', '6', '-',
    'π', '1', '2', '3', '+',
    '@', 'e', '0', '.', '='
  ];

  const buttons = advancedKeyboard ? advancedButtons : defaultButtons;

  function calculator() {
    let lastChar = currentNumber[currentNumber.length - 1];
    if (['/', '*', '-', '+', '.', '%'].includes(lastChar)) {
      setCurrentNumber(currentNumber.slice(0, -1));
    } else {
      let result = eval(currentNumber).toString();
      setCurrentNumber(result);
      return;
    }
  }

  function handleInput(buttonPressed: string) {
    Vibration.vibrate(35);

    if (buttonPressed === '@') {
      setAdvancedKeyboard(!advancedKeyboard);
      return;
    }

    if (buttonPressed === '%') {
      if (['+', '-', '*', '/', '%'].includes(currentNumber[currentNumber.length - 1])) {
        setCurrentNumber((parseFloat(currentNumber.slice(0, -1)) / 100).toString());
      } else {
        setCurrentNumber((parseFloat(currentNumber) / 100).toString());
      }
      return;
    }

    if (['+', '-', '*', '/', '%'].includes(buttonPressed)) {
      if (['+', '-', '*', '/', '%'].includes(currentNumber[currentNumber.length - 1])) {
        setCurrentNumber(currentNumber.slice(0, -1) + buttonPressed);
      } else {
        setCurrentNumber(currentNumber + buttonPressed);
      }
      return;
    }

    if (buttonPressed === '.') {
      if (currentNumber.includes('.') && !['+', '-', '*', '/', '%'].includes(currentNumber[currentNumber.length - 1])) {
        return;
      } else if (['+', '-', '*', '/', '%'].includes(currentNumber[currentNumber.length - 1])) {
        setCurrentNumber(currentNumber + '0.');
      } else {
        setCurrentNumber(currentNumber + '.');
      }
      return;
    }
    if (currentNumber.length >= 15 && !['+', '-', '*', '/', '%', 'DEL', 'C', '='].includes(buttonPressed)) {
      return; // Prevents adding more than 15 digits
    }
    switch (buttonPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.length > 1 ? currentNumber.substring(0, currentNumber.length - 1) : '0');
        return;
      case 'C':
        setLastNumber('');
        setCurrentNumber('0'); 
        return;
      case '=':
        setLastNumber(currentNumber + '=');
        calculator();
        return;
      default:
        setCurrentNumber(currentNumber === '0' ? buttonPressed : currentNumber + buttonPressed);
    }
  }

  return (
    <View style={darkMode ? styles.containerDark : styles.containerLight}>
      <View style={[styles.results, darkMode ? styles.resultsDark : styles.resultsLight]}>
        <TouchableOpacity style={styles.themeButton} onPress={() => setDarkMode(!darkMode)}>
          <Entypo name={darkMode ? 'light-up' : 'moon'} size={24} color={darkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={darkMode ? styles.historyTextDark : styles.historyTextLight}>{lastNumber}</Text>
        <Text style={darkMode ? styles.resultsTextDark : styles.resultsTextLight}>{currentNumber}</Text>
      </View>
      <View style={styles.buttons}>
        {buttons.map((button) =>
          button === '@' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <AntDesign name={advancedKeyboard ? 'shrink' : 'arrowsalt'} size={24} color={darkMode ? '#14FFEC' : '#FF2E63'} />
            </TouchableOpacity>
          ) : button === 'DEL' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, styles.specialButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6 name="delete-left" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '%' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <Feather name="percent" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '/' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <Feather name="divide" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '*' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <Text style={darkMode ? styles.darkTextButton : styles.lightTextButton}>x</Text>
            </TouchableOpacity>
          ) : button === '+' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6 name="add" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '-' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6 name="minus" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '=' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton, advancedKeyboard && styles.advancedButton]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome5 name="equals" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                ['=', '/', '*', '-', '+', '%'].includes(button) && styles.operationButton,
                button === 'C' && styles.specialButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <Text style={[
                darkMode ? styles.darkTextButton : styles.lightTextButton,
                advancedKeyboard && styles.advancedTextButton
              ]}>
                {button}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 100, // Added padding at the bottom
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#222831',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 100,
    //paddingBottom: 20, // Added padding at the bottom
  },
  results: {
    width: '90%',
    minHeight: '35%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  resultsLight: {
    backgroundColor: '#CBF1F5',
  },
  resultsDark: {
    backgroundColor: '#323232',
  },
  resultsTextLight: {
    fontSize: 40,
    color: '#393E46',
  },
  resultsTextDark: {
    fontSize: 40,
    color: '#EEEEEE',
  },
  historyTextLight: {
    fontSize: 20,
    color: '#393E46',
  },
  historyTextDark: {
    fontSize: 20,
    color: '#EEEEEE',
  },
  themeButton: {
    alignSelf: 'flex-start',
    position: 'absolute',
    left: 20,
    top: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#00ADB5',
  },
  buttons: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'space-between',
    // paddingTop: 20,
  },
  button: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  advancedButton: {
    width: '18.5%', // Adjusted button width for advanced keyboard
    aspectRatio: 1, // Maintains square buttons
  },
  lightButton: {
    backgroundColor: '#E3FDFD',
  },
  darkButton: {
    backgroundColor: '#212121',
  },
  operationButton: {
    backgroundColor: '#00ADB5',
  },
  specialButton: {
    backgroundColor: '#FF2E63',
  },
  lightTextButton: {
    fontSize: 24,
    color: '#393E46',
  },
  darkTextButton: {
    fontSize: 24,
    color: '#EEEEEE',
  },
  advancedTextButton: {
    fontSize: 18, // Slightly smaller font size for advanced keyboard
  },
  
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import { Entypo, AntDesign, FontAwesome6, Feather, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('0'); // Default to '0'
  const [lastNumber, setLastNumber] = useState('');
  const [iconToggle, setIconToggle] = useState(false);

  const buttons = [
    'C', 'DEL', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '@', '0', '.', '='
  ];

  function calculator() {
    let lastChar = currentNumber[currentNumber.length - 1];
    if (['/', '*', '-', '+', '.', '%'].includes(lastChar)) {
      // Remove the operator and return the current number
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
      // Do nothing when the @ button is pressed
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
        // Replace the last operator with the new operator
        setCurrentNumber(currentNumber.slice(0, -1) + buttonPressed);
      } else {
        // Append the operator if the last character isn't an operator
        setCurrentNumber(currentNumber + buttonPressed);
      }
      return;
    }

    if (buttonPressed === '.') {
      if (currentNumber.includes('.') && !['+', '-', '*', '/', '%'].includes(currentNumber[currentNumber.length - 1])) {
        return; // Prevent adding a second decimal point
      } else if (['+', '-', '*', '/', '%'].includes(currentNumber[currentNumber.length - 1])) {
        setCurrentNumber(currentNumber + '0.'); // If an operator is the last character, add '0.' instead
      } else {
        setCurrentNumber(currentNumber + '.');
      }
      return;
    }

    switch (buttonPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.length > 1 ? currentNumber.substring(0, currentNumber.length - 1) : '0');
        return;
      case 'C':
        setLastNumber('');
        setCurrentNumber('0'); // Reset to '0'
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
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton]}
              onPress={() => handleInput(button)}
            >
              {iconToggle ? (
                <AntDesign name="shrink" size={24} color={darkMode ? '#14FFEC' : '#71C9CE'} />
              ) : (
                <AntDesign name="arrowsalt" size={24} color={darkMode ? '#14FFEC' : '#71C9CE'} />
              )}
            </TouchableOpacity>
          ) : button === 'DEL' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, styles.specialButton]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6 name="delete-left" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '%' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton]}
              onPress={() => handleInput(button)}
            >
              <Feather name="percent" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '/' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton]}
              onPress={() => handleInput(button)}
            >
              <Feather name="divide" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '+' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6 name="add" size={24} color={darkMode ? '#EEEEEE' : '#393E46'} />
            </TouchableOpacity>
          ) : button === '=' ? (
            <TouchableOpacity
              key={button}
              style={[styles.button, darkMode ? styles.darkButton : styles.lightButton, styles.operationButton]}
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
              ]}
              onPress={() => handleInput(button)}
            >
              <Text style={darkMode ? styles.darkTextButton : styles.lightTextButton}>{button}</Text>
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
  },
  containerDark: {
    flex: 1,
    backgroundColor: '#222831',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#00ADB5',
    borderRadius: 10,
  },
  buttons: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '23%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
  },
  darkButton: {
    backgroundColor: '#212121',
  },
  lightButton: {
    backgroundColor: '#E3FDFD',
  },
operationButton: {
    backgroundColor: '#00ADB5',
  },
  specialButton: {
    backgroundColor: '#FF5722', 
  }, 
  lightTextButton: { 
    fontSize: 24, color: '#393E46', 
  }, 
  darkTextButton: { 
    fontSize: 24, color: '#EEEEEE', 
  }, 
});
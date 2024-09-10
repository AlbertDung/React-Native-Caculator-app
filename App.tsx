import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Vibration,
} from "react-native";
import {
  Entypo,
  AntDesign,
  FontAwesome6,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";

export default function HomeScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("0");
  const [lastNumber, setLastNumber] = useState("");
  const [advancedKeyboard, setAdvancedKeyboard] = useState(false);
  const [secondMode, setSecondMode] = useState(false);

  const [operationState, setOperationState] = useState({
    operation: "",
    firstOperand: "",
    waitingForSecondOperand: false,
  });

  const defaultButtons = [
    "C",
    "DEL",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "@",
    "0",
    ".",
    "=",
  ];

  const advancedButtons = [
    "2nd",
    "deg",
    secondMode ? "sin^-1" : "sin",
    secondMode ? "cos^-1" : "cos",
    secondMode ? "tan^-1" : "tan",
    "^y",
    "lg",
    "ln",
    "(",
    ")",
    "√x",
    "C",
    "DEL",
    "%",
    "/",
    "x!",
    "7",
    "8",
    "9",
    "*",
    "1/x",
    "4",
    "5",
    "6",
    "-",
    "π",
    "1",
    "2",
    "3",
    "+",
    "@",
    "e",
    "0",
    ".",
    "=",
  ];

  const buttons = advancedKeyboard ? advancedButtons : defaultButtons;

  function evaluateExpression(expression: string): number {
    try {
      // Use a library like math.js for better security and functionality
      // return math.evaluate(expression);
      return eval(expression); // For simplicity, but be cautious with eval
    } catch {
      return NaN;
    }
  }

  function handleInput(buttonPressed: string) {
    const operations: { [key: string]: Function } = {
      "^y": (base: number, exponent: number) => Math.pow(base, exponent),
      "√x": (number: number) => Math.sqrt(number),
      "x!": (number: number) => factorial(number),
      "1/x": (denominator: number, numerator: number = 1) =>
        numerator / denominator,
      π: () => Math.PI.toFixed(3),
      e: () => Math.E.toFixed(3),
      sin: (number: number) => Math.sin(toRadians(number)),
      cos: (number: number) => Math.cos(toRadians(number)),
      tan: (number: number) => Math.tan(toRadians(number)),
      "sin^-1": (number: number) => toDegrees(Math.asin(number)),
      "cos^-1": (number: number) => toDegrees(Math.acos(number)),
      "tan^-1": (number: number) => toDegrees(Math.atan(number)),
      ln: (number: number) => Math.log(number), // Natural logarithm (base e)
      lg: (number: number) => Math.log10(number), // Logarithm base 10
    };

    function toDegrees(radians: number) {
      return radians * (180 / Math.PI);
    }

    function factorial(n: number) {
      if (n < 0 || !Number.isInteger(n)) return NaN;
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }

    function toRadians(degrees: number) {
      return degrees * (Math.PI / 180);
    }

    if (operations[buttonPressed]) {
      if (
        [
          "^y",
          "sin",
          "cos",
          "tan",
          "sin^-1",
          "cos^-1",
          "tan^-1",
          "ln",
          "lg",
        ].includes(buttonPressed)
      ) {
        setOperationState({
          operation: buttonPressed,
          firstOperand: currentNumber,
          waitingForSecondOperand: true,
        });
        setCurrentNumber("");
        setLastNumber(lastNumber + `${buttonPressed}(`);
        return;
      }

      if (buttonPressed === "√x") {
        const result = operations[buttonPressed](parseFloat(currentNumber));
        setCurrentNumber(formatResult(result.toString()));
        setLastNumber(lastNumber + `√${currentNumber}`);
        return;
      }

      if (buttonPressed === "x!") {
        const result = operations[buttonPressed](parseFloat(currentNumber));
        if (isNaN(result)) {
          setCurrentNumber("Error");
        } else {
          setCurrentNumber(formatResult(result.toString()));
          setLastNumber(lastNumber + `${currentNumber}!`);
        }
        return;
      }

      if (buttonPressed === "1/x") {
        setOperationState({
          operation: buttonPressed,
          firstOperand: currentNumber,
          waitingForSecondOperand: true,
        });
        setCurrentNumber("");
        setLastNumber(`${currentNumber} 1/x `);
        return;
      }

      if (buttonPressed === "π" || buttonPressed === "e") {
        setCurrentNumber(operations[buttonPressed]().toString());
        setLastNumber(lastNumber + buttonPressed);
        return;
      }
    }

    if (buttonPressed === "=") {
      if (operationState.waitingForSecondOperand) {
        let result;

        if (operationState.operation === "1/x") {
          const denominator = parseFloat(operationState.firstOperand);
          const numerator = currentNumber ? parseFloat(currentNumber) : 1;
          result = operations["1/x"](denominator, numerator);
        } else if (operationState.operation === "^y") {
          const base = parseFloat(operationState.firstOperand);
          const exponent = evaluateExpression(currentNumber);
          result = operations["^y"](base, exponent);
        } else {
          const expression = currentNumber;
          const value = evaluateExpression(expression);
          result = operations[operationState.operation](value);
        }

        setCurrentNumber(formatResult(result.toString()));
        setOperationState({
          operation: "",
          firstOperand: "",
          waitingForSecondOperand: false,
        });
        setLastNumber(
          `${operationState.operation}(${operationState.firstOperand}, ${currentNumber}) = ${result}`
        );
        return;
      } else {
        setLastNumber(`${currentNumber} =`);
        calculateResult();
      }
      return;
    }

    if (buttonPressed === "@") {
      setAdvancedKeyboard(!advancedKeyboard);
      return;
    }
    if (buttonPressed === "2nd") {
      setSecondMode(!secondMode);
      return;
    }

    if (buttonPressed === "%") {
      if (
        ["+", "-", "*", "/", "%"].includes(
          currentNumber[currentNumber.length - 1]
        )
      ) {
        setCurrentNumber(
          (parseFloat(currentNumber.slice(0, -1)) / 100).toString()
        );
      } else {
        setCurrentNumber((parseFloat(currentNumber) / 100).toString());
      }
      return;
    }

    if (["+", "-", "*", "/", "%"].includes(buttonPressed)) {
      if (
        ["+", "-", "*", "/", "%"].includes(
          currentNumber[currentNumber.length - 1]
        )
      ) {
        setCurrentNumber(currentNumber.slice(0, -1) + buttonPressed);
      } else {
        setCurrentNumber(currentNumber + buttonPressed);
      }
      return;
    }

    if (buttonPressed === ".") {
      const parts = currentNumber.split(/[\+\-\*\/\%]/);
      const lastPart = parts[parts.length - 1];
      if (!lastPart.includes(".")) {
        setCurrentNumber(currentNumber + buttonPressed);
      }
      return;
    }

    if (
      currentNumber.length >= 15 &&
      !["+", "-", "*", "/", "%", "DEL", "C", "="].includes(buttonPressed)
    ) {
      return; // Prevents adding more than 15 digits
    }

    switch (buttonPressed) {
      case "DEL":
        setCurrentNumber(
          currentNumber.length > 1
            ? currentNumber.substring(0, currentNumber.length - 1)
            : "0"
        );
        return;
      case "C":
        setLastNumber("");
        setCurrentNumber("0");
        setOperationState({
          operation: "",
          firstOperand: "",
          waitingForSecondOperand: false,
        });
        return;
      default:
        setCurrentNumber(
          currentNumber === "0" ? buttonPressed : currentNumber + buttonPressed
        );
        if (!["+", "-", "*", "/", "%"].includes(buttonPressed)) {
          setLastNumber(lastNumber + buttonPressed);
        }
    }
  }

  function calculateResult() {
    try {
      let result = eval(convertSymbolToNumber(currentNumber)).toString();
      setCurrentNumber(formatResult(result));
    } catch (error) {
      setCurrentNumber("Error");
    }
  }

  function formatResult(number: string) {
    const num = parseFloat(number);
    if (Number.isInteger(num)) {
      return num.toString(); // Return as an integer if it's an integer
    } else {
      return num.toFixed(3); // Otherwise, fix to 3 decimal places
    }
  }

  function convertSymbolToNumber(value: string) {
    return value
      .replace(/π/g, Math.PI.toFixed(3))
      .replace(/e/g, Math.E.toFixed(3));
  }
  return (
    <View style={darkMode ? styles.containerDark : styles.containerLight}>
      <View
        style={[
          styles.results,
          darkMode ? styles.resultsDark : styles.resultsLight,
        ]}
      >
        <TouchableOpacity
          style={styles.themeButton}
          onPress={() => setDarkMode(!darkMode)}
        >
          <Entypo
            name={darkMode ? "light-up" : "moon"}
            size={24}
            color={darkMode ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text
          style={darkMode ? styles.historyTextDark : styles.historyTextLight}
        >
          {lastNumber}
        </Text>
        <Text
          style={darkMode ? styles.resultsTextDark : styles.resultsTextLight}
        >
          {currentNumber}
        </Text>
      </View>
      <View style={styles.buttons}>
        {buttons.map((button) =>
          button === "@" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <AntDesign
                name={advancedKeyboard ? "shrink" : "arrowsalt"}
                size={24}
                color={darkMode ? "#14FFEC" : "#FF2E63"}
              />
            </TouchableOpacity>
          ) : button === "DEL" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                styles.specialButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6
                name="delete-left"
                size={24}
                color={darkMode ? "#EEEEEE" : "#393E46"}
              />
            </TouchableOpacity>
          ) : button === "%" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                styles.operationButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <Feather
                name="percent"
                size={24}
                color={darkMode ? "#EEEEEE" : "#393E46"}
              />
            </TouchableOpacity>
          ) : button === "/" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                styles.operationButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <Feather
                name="divide"
                size={24}
                color={darkMode ? "#EEEEEE" : "#393E46"}
              />
            </TouchableOpacity>
          ) : button === "*" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                styles.operationButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <Text
                style={
                  darkMode ? styles.darkTextButton : styles.lightTextButton
                }
              >
                x
              </Text>
            </TouchableOpacity>
          ) : button === "+" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                styles.operationButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6
                name="add"
                size={24}
                color={darkMode ? "#EEEEEE" : "#393E46"}
              />
            </TouchableOpacity>
          ) : button === "-" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                styles.operationButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome6
                name="minus"
                size={24}
                color={darkMode ? "#EEEEEE" : "#393E46"}
              />
            </TouchableOpacity>
          ) : button === "=" ? (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                styles.operationButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <FontAwesome5
                name="equals"
                size={24}
                color={darkMode ? "#EEEEEE" : "#393E46"}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={button}
              style={[
                styles.button,
                darkMode ? styles.darkButton : styles.lightButton,
                ["=", "/", "*", "-", "+", "%"].includes(button) &&
                  styles.operationButton,
                button === "C" && styles.specialButton,
                advancedKeyboard && styles.advancedButton,
              ]}
              onPress={() => handleInput(button)}
            >
              <Text
                style={[
                  darkMode ? styles.darkTextButton : styles.lightTextButton,
                  advancedKeyboard && styles.advancedTextButton,
                ]}
              >
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
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 100, // Added padding at the bottom
  },
  containerDark: {
    flex: 1,
    backgroundColor: "#222831",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 100,
    //paddingBottom: 20, // Added padding at the bottom
  },
  results: {
    width: "90%",
    minHeight: "35%",
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  resultsLight: {
    backgroundColor: "#CBF1F5",
  },
  resultsDark: {
    backgroundColor: "#323232",
  },
  resultsTextLight: {
    fontSize: 40,
    color: "#393E46",
  },
  resultsTextDark: {
    fontSize: 40,
    color: "#EEEEEE",
  },
  historyTextLight: {
    fontSize: 20,
    color: "#393E46",
  },
  historyTextDark: {
    fontSize: 20,
    color: "#EEEEEE",
  },
  themeButton: {
    alignSelf: "flex-start",
    position: "absolute",
    left: 20,
    top: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#00ADB5",
  },
  buttons: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "space-between",
    // paddingTop: 20,
  },
  button: {
    width: "23%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
  },
  advancedButton: {
    width: "18.5%", // Adjusted button width for advanced keyboard
    aspectRatio: 1, // Maintains square buttons
  },
  lightButton: {
    backgroundColor: "#E3FDFD",
  },
  darkButton: {
    backgroundColor: "#212121",
  },
  operationButton: {
    backgroundColor: "#00ADB5",
  },
  specialButton: {
    backgroundColor: "#FF2E63",
  },
  lightTextButton: {
    fontSize: 24,
    color: "#393E46",
  },
  darkTextButton: {
    fontSize: 24,
    color: "#EEEEEE",
  },
  advancedTextButton: {
    fontSize: 18, // Slightly smaller font size for advanced keyboard
  },
});
function formatNumber(result: any): React.SetStateAction<string> {
  throw new Error("Function not implemented.");
}

function convertSymbolToNumber(firstOperand: string): string {
  throw new Error("Function not implemented.");
}

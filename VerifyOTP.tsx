import React, { useState, useRef, useEffect } from "react";
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
interface VerifyOtpProps {
  initialOtp: string[];
  numberOfInputs: number;
  activeBorderColor?: ColorValue;
  inActiveBorderColor?: ColorValue;
  commonBorderColor: ColorValue;
  boxStyle?: StyleProp<ViewStyle>;
}
const VerifyOTP: React.FC<VerifyOtpProps> = ({
  initialOtp,
  numberOfInputs,
  activeBorderColor,
  inActiveBorderColor,
  commonBorderColor,
  boxStyle
}) => {
  const [otp, setOtp] = useState(initialOtp);
  const refs = useRef([...Array(numberOfInputs)].map(() => React.createRef()));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [allInputsFilled, setAllInputsFilled] = useState(false);
  const handleOtpChange = (value, index) => {
    if (value?.replace(/ /g, "").length === numberOfInputs) {
      handlePasteFromClipboard(value);
    } else {
      const newOtp = [...otp];
      if (value.length === 1) {
        newOtp[index] = value;
      } else if (value.length > 1) {
        newOtp[index] = value[value.length - 1];
      } else {
        newOtp[index] = "";
      }
      if (index < numberOfInputs - 1 && value !== "") {
        refs.current[index + 1].focus();
      } else if (index > 0 && value === "") {
        refs.current[index - 1].focus();
      }
      setOtp(newOtp);
    }
  };
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      refs.current[index - 1].focus();
    }
  };
  const handlePasteFromClipboard = async (clipboardContent) => {
    try {
      const clipboardOtp = clipboardContent
        .slice(0, numberOfInputs)
        .split("")
        .map((char) => char.trim());
      const newOtp = [...otp];
      clipboardOtp.forEach((char, index) => {
        if (index < numberOfInputs) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      refs.current[numberOfInputs - 1].focus();
    } catch (error) {
      console.error("Error pasting from clipboard:", error);
    }
  };
  useEffect(() => {
    refs.current[0].focus();
  }, []);
  useEffect(() => {
    const isAllFilled = otp.every((digit) => digit !== "");
    setAllInputsFilled(isAllFilled);
  }, [otp]);
  return (
    <View style={styles.container}>
      {otp?.map((digit, index) => (
        <TextInput
          autoFocus={index === 0}
          key={index}
          style={[boxStyle,
            styles.input,
            {
              borderWidth: index === focusedIndex ? 1 : 0.5,
              borderColor:
                index === focusedIndex
                  ? activeBorderColor
                  : inActiveBorderColor,
            },
            allInputsFilled && { borderColor: commonBorderColor },
          ]}
          value={digit}
          maxLength={numberOfInputs}
          keyboardType={"numeric"}
          onChangeText={(value) => handleOtpChange(value, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          placeholder="0"
          ref={(inputRef) => (refs.current[index] = inputRef)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 23,
    gap: 7,
    marginTop: 22,
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
    height: 56,
    width: 49,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
});
export default VerifyOTP;



<VerifyOTP
  boxStyle={{marginRight:40}}
                  initialOtp={["","","",""]}
                  numberOfInputs={4}
                  activeBorderColor={"blue"}
                  inActiveBorderColor={"black"}
                  commonBorderColor={"green"}/>

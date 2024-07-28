import React, { useState, useRef, useEffect } from "react"; // Importing React and hooks for state and lifecycle management
import { View, Text, Image, Keyboard } from "react-native"; // Importing components from react-native for UI
import { SignUpFormData } from "@/helpers/validations"; // Importing types for form data
import { Button, Input } from "tamagui"; // Importing Button and Input from tamagui for UI components

interface OTPScreenProps {
  route: {
    params: {
      formData: SignUpFormData;
    };
  };
}

const OTPScreen: React.FC<OTPScreenProps> = ({ route }) => {
  const [otp, setOTP] = useState(Array(6).fill("")); // State to store OTP digits
  const inputRefs = useRef<Array<Input | null>>([]); // Refs for OTP input fields
  const [keyboardVisible, setKeyboardVisible] = useState(false); // State to track if the keyboard is visible

  useEffect(() => {
    // Effect to handle keyboard visibility
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true) // Set keyboardVisible to true when keyboard is shown
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false) // Set keyboardVisible to false when keyboard is hidden
    );

    return () => {
      // Cleanup listeners on component unmount
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleChange = (text: string, index: number) => {
    // Function to handle OTP input change
    if (text.length === 1 && /^\d$/.test(text)) {
      const newOTP = [...otp];
      newOTP[index] = text;
      setOTP(newOTP);

      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus(); // Move to the next input field
      }
    } else if (text === "") {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus(); // Move to the previous input field
      }
    }
  };

  const handleVerifyOTP = async () => {
    // Function to handle OTP verification
    try {
      const otpString = otp.join(""); // Combine OTP digits into a single string
      console.log("OTP:", otpString); // Log OTP to console
    } catch (error) {
      console.error("Error verifying OTP:", error); // Log error if OTP verification fails
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 ">
      {/* Main container with flex layout */}
      <View className="w-full mb-4 justify-center items-center">
        {/* Container for logo and title */}
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}
        {/* Display logo if keyboard is not visible */}
        <Text className="text-4xl font-bold text-white">OTP Verification</Text>
        {/* Title */}
      </View>
      <View className="flex gap-2 mb-4">
        {/* Container for OTP instructions */}
        <Text className="text-white text-xl font-semibold text-center">
          OTP sent to ***sam@gmail.com.
        </Text>
        <Text className="text-gray-300 font-semibold text-center">
          OTP will expire in 10 minutes.
        </Text>
      </View>
      <View className="flex-row items-center gap-2 mb-4">
        {/* Container for OTP input fields */}
        {otp.map((digit, index) => (
          <Input
            key={index}
            size={"$4"}
            height={"$5"}
            textAlign="center"
            ref={(ref) => (inputRefs.current[index] = ref)}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            borderRadius={"$4"}
            borderColor={"blue"}
            onChangeText={(text) => handleChange(text, index)}
            placeholder="_"
          />
        ))}
      </View>
      <Text className="text-gray-300 my-4 font-semibold text-center">
        Didn't receive OTP? <Text className="text-blue-500">Resend</Text>
      </Text>
      {/* Resend OTP link */}
      <Button
        width="100%"
        margin="$2"
        opacity={otp.some((digit) => digit === "") ? 0.5 : 1}
        onPress={handleVerifyOTP}
        disabled={otp.some((digit) => digit === "")}
        pressStyle={{ elevate: true }}
      >
        Verify OTP
      </Button>
      {/* Verify OTP button */}
    </View>
  );
};

export default OTPScreen; // Exporting the OTPScreen component

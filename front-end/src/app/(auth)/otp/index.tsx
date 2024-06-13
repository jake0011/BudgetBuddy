import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, Keyboard } from "react-native";
import { SignUpFormData } from "@/helpers/validations";
import { Button, Input } from "tamagui";

interface OTPScreenProps {
  route: {
    params: {
      formData: SignUpFormData;
    };
  };
}

const OTPScreen: React.FC<OTPScreenProps> = ({ route }) => {
  const [otp, setOTP] = useState(Array(6).fill(""));
  const inputRefs = useRef<Array<Input | null>>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleChange = (text: string, index: number) => {
    if (text.length === 1 && /^\d$/.test(text)) {
      const newOTP = [...otp];
      newOTP[index] = text;
      setOTP(newOTP);

      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (text === "") {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpString = otp.join("");
      console.log("OTP:", otpString);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 ">
      <View className="w-full mb-4 justify-center items-center">
        {!keyboardVisible && (
          <Image
            source={require("../../../../assets/logo.png")}
            resizeMode="cover"
            className="rounded-full w-60 h-52 object-contain object-center"
          />
        )}
        <Text className="text-4xl font-bold text-white">OTP Verification</Text>
      </View>
      <View className="flex gap-2 mb-4">
        <Text className="text-white text-xl font-semibold text-center">
          OTP sent to ***sam@gmail.com.
        </Text>
        <Text className="text-gray-300 font-semibold text-center">
          OTP will expire in 10 minutes.
        </Text>
      </View>
      <View className="flex-row items-center gap-2 mb-4">
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
    </View>
  );
};

export default OTPScreen;

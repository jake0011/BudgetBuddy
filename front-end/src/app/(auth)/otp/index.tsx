import React, { useState, useRef } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
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
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOTPChange = (text: string, index: number) => {
    if (/^\d$/.test(text) || text === "") {
      const newOTP = [...otp];
      newOTP[index] = text;
      setOTP(newOTP);

      if (text !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpString = otp.join("");
      console.log("OTP:", otpString);
      // const verificationResponse = await verifyOTP(formData, otpString);
      // if (verificationResponse.success) {
      //   // Handle successful OTP verification
      //   console.log('OTP verification successful!');
      // } else {
      //   // Handle error case
      //   console.error('Error verifying OTP:', verificationResponse.error);
      // }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 ">
      <Text className="text-2xl font-bold mb-4 text-white">Enter OTP</Text>
      <Text className="text-center mb-4 text-white">
        We have sent an OTP to your email. Please check your email and enter the
        OTP below.
      </Text>
      <View className="flex-row items-center gap-2 mb-4">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleOTPChange(text, index)}
          />
        ))}
      </View>
      <Button
        width="100%"
        onPress={handleVerifyOTP}
        disabled={otp.some((digit) => digit === "")}
      >
        Verify OTP
      </Button>
    </View>
  );
};

export default OTPScreen;

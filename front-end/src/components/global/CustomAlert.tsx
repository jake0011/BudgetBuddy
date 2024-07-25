import React from "react";
import { Text, View } from "react-native";
import { AlertDialog, Button, Spinner, XStack, YStack } from "tamagui";

interface CustomAlertProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  message: string;
  loading: boolean;
}

const CustomAlert = ({
  visible,
  onDismiss,
  onConfirm,
  message,
  loading,
}: CustomAlertProps) => {
  return (
    <AlertDialog open={visible} onOpenChange={onDismiss}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.7}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          style={{ backgroundColor: "#161E2B", color: "white" }}
        >
          <YStack space>
            <AlertDialog.Title style={{ color: "white", textAlign: "center" }}>
              Confirm Deletion
            </AlertDialog.Title>
            <AlertDialog.Description style={{ color: "white" }}>
              {message}
            </AlertDialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button onPress={onDismiss} disabled={loading} color="$gray50">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  onPress={onConfirm}
                  theme="active"
                  disabled={loading}
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  {loading && <Spinner size="small" color="white" />} Delete
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default CustomAlert;

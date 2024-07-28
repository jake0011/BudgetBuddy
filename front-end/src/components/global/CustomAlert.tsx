import React from "react"; // Importing React library
import { Text, View } from "react-native"; // Importing components from react-native
import { AlertDialog, Button, Spinner, XStack, YStack } from "tamagui"; // Importing components from tamagui

// Defining the props for the CustomAlert component
interface CustomAlertProps {
  visible: boolean; // Whether the alert is visible
  onDismiss: () => void; // Function to call when the alert is dismissed
  onConfirm: () => void; // Function to call when the confirm button is pressed
  message: string; // Message to display in the alert
  loading: boolean; // Whether a loading spinner should be shown
}

// CustomAlert component definition
const CustomAlert = ({
  visible,
  onDismiss,
  onConfirm,
  message,
  loading,
}: CustomAlertProps) => {
  return (
    // AlertDialog component to display the alert
    <AlertDialog open={visible} onOpenChange={onDismiss}>
      <AlertDialog.Portal>
        {/* Overlay for the alert dialog */}
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.7}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        {/* Content of the alert dialog */}
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
          {/* Stack layout for the content */}
          <YStack space>
            {/* Title of the alert */}
            <AlertDialog.Title style={{ color: "white", textAlign: "center" }}>
              Confirm Deletion
            </AlertDialog.Title>
            {/* Description/message of the alert */}
            <AlertDialog.Description style={{ color: "white" }}>
              {message}
            </AlertDialog.Description>
            {/* Buttons for cancel and confirm actions */}
            <XStack gap="$3" justifyContent="flex-end">
              {/* Cancel button */}
              <AlertDialog.Cancel asChild>
                <Button onPress={onDismiss} disabled={loading} color="$gray50">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              {/* Confirm button */}
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

export default CustomAlert; // Exporting the CustomAlert component as default

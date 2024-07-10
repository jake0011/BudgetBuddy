import React, { useMemo } from "react";
import { Select, YStack, Adapt, Sheet, PortalProvider } from "tamagui";
import { ChevronDown, ChevronUp, Check } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";

const CustomSelect = ({ value, onValueChange, placeholder, items, label }) => {
  return (
    <PortalProvider>
      <Select
        value={value}
        onValueChange={onValueChange}
        disablePreventBodyScroll
      >
        <Select.Trigger width={220} iconAfter={ChevronDown}>
          <Select.Value placeholder={placeholder} />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet
            native
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: "spring",
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}
          >
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={["$background", "transparent"]}
              borderRadius="$4"
            />
          </Select.ScrollUpButton>

          <Select.Viewport minWidth={200}>
            <Select.Group>
              <Select.Label>{label}</Select.Label>
              {useMemo(
                () =>
                  items.map((item, i) => (
                    <Select.Item index={i} key={i} value={item.value}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )),
                [items]
              )}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={["transparent", "$background"]}
              borderRadius="$4"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </PortalProvider>
  );
};

export default CustomSelect;

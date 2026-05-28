/**
 * @fileoverview Reusable Input Modal component for collecting text input from users.
 * Provides a modal dialog with text input field, confirmation and cancellation buttons.
 * Supports keyboard handling, placeholder text, default values, and responsive design.
 * Used throughout the app for adding new items, editing content, and collecting user input.
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

/**
 * Props interface for the InputModal component.
 * Defines all configurable options for the modal dialog behavior and appearance.
 */
interface InputModalProps {
  /** Whether the modal is visible and should be displayed */
  visible: boolean;
  /** Title text displayed at the top of the modal */
  title: string;
  /** Optional placeholder text for the input field */
  placeholder?: string;
  /** Optional default value to pre-populate the input field */
  defaultValue?: string;
  /** Callback function called when the user confirms input */
  onConfirm: (value: string) => void;
  /** Callback function called when the user cancels or dismisses the modal */
  onCancel: () => void;
}

/**
 * InputModal component that renders a modal dialog with text input capabilities.
 * Manages internal state for the input value and provides keyboard handling.
 *
 * @param visible - Controls modal visibility
 * @param title - Modal title text
 * @param placeholder - Input field placeholder text
 * @param defaultValue - Default input value (defaults to empty string)
 * @param onConfirm - Callback for confirm action with input value
 * @param onCancel - Callback for cancel action
 */
export const InputModal: React.FC<InputModalProps> = ({
  visible,
  title,
  placeholder,
  defaultValue = '',
  onConfirm,
  onCancel,
}) => {
  const { colors, brandColor } = useTheme();
  const [value, setValue] = useState(defaultValue);

  /**
   * Effect to reset input value when modal becomes visible or default value changes.
   * Ensures fresh state for each modal interaction.
   */
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, visible]);

  /**
   * Handles confirm action by calling the onConfirm callback with current value
   * and resetting the input field.
   */
  const handleConfirm = () => {
    onConfirm(value);
    setValue('');
  };

  /**
   * Handles cancel action by calling the onCancel callback and clearing the input field.
   */
  const handleCancel = () => {
    onCancel();
    setValue('');
  };

  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    modal: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.border,
      marginRight: 8,
    },
    confirmButton: {
      backgroundColor: brandColor,
      marginLeft: 8,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={dynamicStyles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={dynamicStyles.modal}>
          <Text style={dynamicStyles.title}>{title}</Text>

          <TextInput
            style={dynamicStyles.input}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.subtext}
            autoFocus
            selectTextOnFocus
            onSubmitEditing={handleConfirm}
            returnKeyType="done"
          />

          <View style={dynamicStyles.buttonContainer}>
            <TouchableOpacity
              style={[dynamicStyles.button, dynamicStyles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={dynamicStyles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[dynamicStyles.button, dynamicStyles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={dynamicStyles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
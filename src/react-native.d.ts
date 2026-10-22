declare module 'react-native' {
  import * as React from 'react';

  export type ViewStyle = any;
  export type TextStyle = any;
  export type ImageStyle = any;

  export interface ViewProps {
    [key: string]: any;
  }

  export interface TextProps {
    [key: string]: any;
  }

  export interface ScrollViewProps {
    [key: string]: any;
  }

  export interface ActivityIndicatorProps {
    [key: string]: any;
  }

  export interface PressableProps {
    [key: string]: any;
  }

  export interface ModalProps {
    [key: string]: any;
  }

  export interface ImageProps {
    [key: string]: any;
  }

  export interface TextInputProps {
    [key: string]: any;
  }

  export interface KeyboardAvoidingViewProps {
    [key: string]: any;
  }

  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const ActivityIndicator: React.FC<ActivityIndicatorProps>;
  export const Pressable: React.FC<PressableProps>;
  export const Modal: React.FC<ModalProps>;
  export const Image: React.FC<ImageProps>;
  export const TextInput: React.FC<TextInputProps>;
  export const KeyboardAvoidingView: React.FC<KeyboardAvoidingViewProps>;

  export namespace StyleSheet {
    function create<T extends Record<string, any>>(obj: T): T;
    const absoluteFill: any;
  }

  export namespace Alert {
    function alert(title: string, message?: string, buttons?: any[], options?: any): void;
  }

  export namespace Platform {
    const OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
    const Version: number | string;
    const select: (obj: Record<string, any>) => any;
  }

  export namespace Linking {
    function openURL(url: string): Promise<boolean>;
    function canOpenURL(url: string): Promise<boolean>;
    function openSettings(): Promise<void>;
  }

  export namespace AppState {
    const currentState: string;
    function addEventListener(eventType: string, listener: (state: string) => void): any;
  }
}

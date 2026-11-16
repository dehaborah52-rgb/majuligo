declare module 'react-native' {
  import * as React from 'react';

  export const StyleSheet: {
    create<T extends Record<string, any>>(styles: T): T;
  };

  export const Text: React.FC<any>;
  export const View: React.FC<any>;
  export const SafeAreaView: React.FC<any>;
  export const TouchableOpacity: React.FC<any>;
  export const TextInput: React.FC<any>;
  export const ScrollView: React.FC<any>;
  export const StatusBar: React.FC<any>;
  export const Switch: React.FC<any>;
}

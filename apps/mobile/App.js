import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MapScreen from './src/MapScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <MapScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
});

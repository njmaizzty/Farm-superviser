import { IconSymbol } from '@/components/ui/icon-symbol';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateBlockScreen() {
  const router = useRouter();
  const { phaseData } = useLocalSearchParams();
  const parsedPhase = phaseData ? JSON.parse(phaseData as string) : {};

  const [blockData, setBlockData] = useState<any>({
    phaseName: parsedPhase.phaseName || '',
    phaseNumber: parsedPhase.phaseNumber || '',
    blockName: '',
    blockNumber: '',
    areaHectare: '',
    areaAcre: '',
    status: '',
    soilType: '',
    drainage: '',
    accessibility: '',
  });

  const handleChange = (field: string, value: string) => {
    setBlockData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCreateBlock = () => {
    const missing = Object.entries(blockData).filter(
      ([_, v]) => !v || String(v).trim() === ''
    );

    if (missing.length) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    router.push({
      pathname: '/add-tree',
      params: {
        phaseData: JSON.stringify(parsedPhase),
        blockData: JSON.stringify(blockData),
      },
    });
  };

  // ---------------- OPTIONS ----------------
  const BLOCK_NAMES = Array.from({ length: 26 }, (_, i) =>
    `Block ${String.fromCharCode(65 + i)}`
  );
  const BLOCK_NUMBERS = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
  const STATUS = ['Active', 'Maintenance', 'Inactive'];
  const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Peaty'];
  const DRAINAGE = ['Good', 'Moderate', 'Poor'];
  const ACCESS = ['Easy', 'Moderate', 'Difficult'];

  // ---------------- PICKERS ----------------
  const renderScrollPicker = (
    label: string,
    field: string,
    options: string[]
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.clearSelectedBox}>
        <Text style={styles.clearSelectedText}>
          {blockData[field] || 'No selection'}
        </Text>
      </View>

      <View style={styles.pickerContainerLarge}>
        <Picker
          selectedValue={blockData[field]}
          onValueChange={(value) => handleChange(field, value)}
        >
          <Picker.Item label="Scroll to select" value="" />
          {options.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>
    </View>
  );

  const renderButtonOptions = (label: string, field: string, options: string[]) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.buttonContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              blockData[field] === option && styles.optionButtonSelected,
            ]}
            onPress={() => handleChange(field, option)}
          >
            <Text
              style={[
                styles.optionButtonText,
                blockData[field] === option && styles.optionButtonTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {blockData[field] ? (
        <Text style={styles.selectedText}>Selected: {blockData[field]}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Block</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.form}>

          {/* Phase Info */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phase Name</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={blockData.phaseName}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phase Number</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={blockData.phaseNumber}
              editable={false}
            />
          </View>

          {/* Block */}
          {renderScrollPicker('Block Name', 'blockName', BLOCK_NAMES)}
          {renderScrollPicker('Block Number', 'blockNumber', BLOCK_NUMBERS)}

          {/* Area */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area (Hectare)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(v) => handleChange('areaHectare', v)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area (Acre)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(v) => handleChange('areaAcre', v)}
            />
          </View>

          {/* Button Options */}
          {renderButtonOptions('Status', 'status', STATUS)}
          {renderButtonOptions('Soil Type', 'soilType', SOIL_TYPES)}
          {renderButtonOptions('Drainage', 'drainage', DRAINAGE)}
          {renderButtonOptions('Accessibility', 'accessibility', ACCESS)}

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateBlock}
          >
            <Text style={styles.submitButtonText}>Create Block</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFE' },

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
  },

  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A237E' },

  form: { padding: 24 },

  inputGroup: { marginBottom: 20 },

  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },

  input: {
    height: 52,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },

  disabledInput: { backgroundColor: '#EEE' },

  clearSelectedBox: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  clearSelectedText: { fontSize: 18, fontWeight: '700', color: '#FFF' },

  pickerContainerLarge: {
    height: 200,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2E7D32',
    marginRight: 10,
    marginBottom: 10,
  },

  optionButtonSelected: {
    backgroundColor: '#2E7D32',
  },

  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },

  optionButtonTextSelected: {
    color: '#FFF',
  },

  selectedText: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#333',
  },

  footer: {
    padding: 24,
    backgroundColor: '#FFF',
  },

  submitButton: {
    height: 52,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

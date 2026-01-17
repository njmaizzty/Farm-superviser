import { IconSymbol } from '@/components/ui/icon-symbol';
import DateTimePicker from '@react-native-community/datetimepicker';
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
    treesPerHectare: '',
    totalTrees: '',
    palmVariety: '',
    plantingDate: '',
    palmAge: '',
    estimatedYield: '',
    slope: '',
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
  const PALM_VARIETIES = ['Dura', 'Tenera', 'Pisifera'];
  const SLOPE_OPTIONS = Array.from({ length: 100 }, (_, i) => `${i + 1}%`);
  const PALM_AGE_YEARS = Array.from(
    { length: 2026 - 1950 + 1 },
    (_, i) => `${1950 + i}`
  ).reverse();

  // ---------------- PICKERS ----------------
  const renderScrollPickerLikeTreeNumber = (
    label: string,
    field: string,
    options: string[],
    placeholder: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      {/* GREEN SELECTED BOX */}
      <View style={styles.clearSelectedBox}>
        <Text style={styles.clearSelectedText}>
          {blockData[field] || placeholder}
        </Text>
      </View>

      {/* SCROLL PICKER */}
      <View style={styles.pickerContainerLarge}>
        <Picker
          selectedValue={blockData[field] || ''}
          onValueChange={(value) => handleChange(field, value)}
        >
          <Picker.Item label={`Scroll to select ${label.toLowerCase()}`} value="" />
          {options.map((item) => (
            <Picker.Item key={item} label={item} value={item} color="#000" />
          ))}
        </Picker>
      </View>
    </View>
  );

  const renderFullWidthOptions = (
    label: string,
    field: string,
    options: string[]
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.fullWidthButton,
            blockData[field] === option && styles.fullWidthButtonSelected,
          ]}
          onPress={() => handleChange(field, option)}
        >
          <Text
            style={[
              styles.fullWidthButtonText,
              blockData[field] === option &&
                styles.fullWidthButtonTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      {blockData[field] ? (
        <Text style={styles.selectedText}>Selected: {blockData[field]}</Text>
      ) : null}
    </View>
  );

  const renderNumericInput = (label: string, field: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        value={blockData[field]}
        onChangeText={(v) => handleChange(field, v)}
      />
    </View>
  );

  const renderCalendarPicker = (label: string, field: string) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={[styles.input, styles.centerContent]}
          onPress={() => setShowPicker(true)}
        >
          <Text
            style={[
              styles.centerText,
              { color: blockData[field] ? '#333' : '#999' },
            ]}
          >
            {blockData[field] || 'Tap to select date'}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={blockData[field] ? new Date(blockData[field]) : new Date()}
            mode="date"
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) {
                handleChange(field, date.toISOString().split('T')[0]);
              }
            }}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
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

          {/* Block Name Picker like Tree Number */}
          {renderScrollPickerLikeTreeNumber(
            'Block Name',
            'blockName',
            BLOCK_NAMES,
            'No Block Name Selected'
          )}

          {/* Block Number Picker like Tree Number */}
          {renderScrollPickerLikeTreeNumber(
            'Block Number',
            'blockNumber',
            BLOCK_NUMBERS,
            'No Block Number Selected'
          )}

          {renderNumericInput('Area (Hectare)', 'areaHectare')}
          {renderNumericInput('Area (Acre)', 'areaAcre')}

          {renderFullWidthOptions('Status', 'status', STATUS)}
          {renderFullWidthOptions('Soil Type', 'soilType', SOIL_TYPES)}
          {renderFullWidthOptions('Drainage', 'drainage', DRAINAGE)}
          {renderFullWidthOptions('Accessibility', 'accessibility', ACCESS)}

          {renderNumericInput('Trees per Hectare', 'treesPerHectare')}
          {renderNumericInput('Total Trees', 'totalTrees')}
          {renderFullWidthOptions('Palm Variety', 'palmVariety', PALM_VARIETIES)}

          {renderCalendarPicker('Planting Date', 'plantingDate')}

          {/* Palm Age Picker like Tree Number */}
          {renderScrollPickerLikeTreeNumber(
            'Palm Age (Years)',
            'palmAge',
            PALM_AGE_YEARS,
            'No Palm Age Selected'
          )}

          {renderScrollPickerLikeTreeNumber(
            'Slope (%)',
            'slope',
            SLOPE_OPTIONS,
            'No Slope Selected'
          )}

          {renderNumericInput('Estimated Yield (tons)', 'estimatedYield')}
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
    justifyContent: 'center',
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
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  fullWidthButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  fullWidthButtonSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  fullWidthButtonText: { fontSize: 16, fontWeight: '600', color: '#333' },
  fullWidthButtonTextSelected: { color: '#FFF' },
  selectedText: { color: '#2E7D32', fontWeight: '500' },
  footer: { padding: 24, backgroundColor: '#FFF' },
  submitButton: {
    height: 52,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  centerText: { fontSize: 16, fontWeight: '500' },
});

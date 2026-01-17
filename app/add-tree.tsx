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

const TREE_NUMBERS = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
const HEALTH_SCORES = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
const AGE_YEARS = Array.from({ length: 77 }, (_, i) => `${2026 - i}`); // 2026 → 1950

// Full-width selectable options
const TAG_TYPES = ['Oil Palm Tree', 'Crop'];
const DISEASES = [
  'Ganoderma Basal Stem Rot (BSR)',
  'Fusarium Wilt',
  'Pink Disease',
  'Anthracnose',
  'Fatal Yellowing',
];
const STATUS_OPTIONS = [
  'Healthy',
  'Diseased',
  'Infected (Early Stage)',
  'Infected (Severe)',
  'Dead/Fallen',
  'Recovered',
];

export default function AddTreeScreen() {
  const router = useRouter();
  const { phaseData, blockData } = useLocalSearchParams();
  const parsedPhase = phaseData ? JSON.parse(phaseData as string) : {};
  const parsedBlock = blockData ? JSON.parse(blockData as string) : {};

  const [treeData, setTreeData] = useState<any>({
    treeNumber: '',
    block: parsedBlock.blockName || '', // Automatically take block name
    tagType: '',
    tagID: '',
    age: '',
    status: '',
    diseases: '',
    plantingDate: '',
    height: '',
    trunkCircumference: '',
    variety: parsedBlock.palmVariety || '', // Automatically take palm variety
    healthScore: '',
    estimatedYield: '',
  });

  const handleInputChange = (field: string, value: string) => {
    // Reset disease if status changes to a non-disease option
    if (
      field === 'status' &&
      !['Diseased', 'Infected (Early Stage)', 'Infected (Severe)'].includes(
        value
      )
    ) {
      setTreeData((prev: any) => ({ ...prev, status: value, diseases: '' }));
    } else {
      setTreeData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTree = () => {
    if (!treeData.treeNumber) {
      Alert.alert('Error', 'Tree Number is required.');
      return;
    }

    router.push({
      pathname: '/areas',
      params: {
        areaData: JSON.stringify({
          phase: parsedPhase,
          block: parsedBlock,
          trees: [treeData],
        }),
      },
    });
  };

  // Full-width button render helper
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
            treeData[field] === option && styles.fullWidthButtonSelected,
          ]}
          onPress={() => handleInputChange(field, option)}
        >
          <Text
            style={[
              styles.fullWidthButtonText,
              treeData[field] === option && styles.fullWidthButtonTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      {treeData[field] ? (
        <Text style={styles.selectedText}>Selected: {treeData[field]}</Text>
      ) : null}
    </View>
  );

  // Calendar Picker for Planting Date
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
          style={[styles.centerText, { color: treeData[field] ? '#333' : '#999' }]}
        >
          {treeData[field] || 'Tap to select date'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={treeData[field] ? new Date(treeData[field]) : new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) {
              const isoDate = date.toISOString().split('T')[0];
              handleInputChange(field, isoDate);
            }
          }}
        />
      )}
    </View>
  );
};

  // Numeric Input Helper
  const renderNumericInput = (label: string, field: string, placeholder?: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        value={treeData[field]}
        onChangeText={(v) => handleInputChange(field, v)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Tree</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.form}>

            {/* TREE NUMBER */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tree Number</Text>
              <View style={styles.clearSelectedBox}>
                <Text style={styles.clearSelectedText}>
                  {treeData.treeNumber || 'No tree selected'}
                </Text>
              </View>
              <View style={styles.pickerContainerLarge}>
                <Picker
                  selectedValue={treeData.treeNumber}
                  onValueChange={(value) => handleInputChange('treeNumber', value)}
                >
                  <Picker.Item label="Scroll to select tree number" value="" />
                  {TREE_NUMBERS.map((num) => (
                    <Picker.Item key={num} label={num} value={num} color="#000" />
                  ))}
                </Picker>
              </View>
            </View>

            {/* BLOCK - Auto from CreateBlockScreen */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Block Name</Text>
              <TextInput style={[styles.input, styles.disabledInput]} value={treeData.block} editable={false} />
            </View>

            {/* TAG TYPE */}
            {renderFullWidthOptions('Tag Type', 'tagType', TAG_TYPES)}

            {/* TAG ID */}
            {/* TAG ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tag ID</Text>
                <TextInput
              style={styles.input}
              placeholder="Enter Tag ID (e.g., T-001)"
              placeholderTextColor="#999999"  // Subtle gray color
              value={treeData.tagID}
              onChangeText={(t) => handleInputChange('tagID', t)}
                />
                    </View>

            {/* AGE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age (Year Planted)</Text>
              <View style={styles.clearSelectedBox}>
                <Text style={styles.clearSelectedText}>
                  {treeData.age || 'No year selected'}
                </Text>
              </View>
              <View style={styles.pickerContainerLarge}>
                <Picker
                  selectedValue={treeData.age}
                  onValueChange={(value) => handleInputChange('age', value)}
                >
                  <Picker.Item label="Scroll to select year" value="" />
                  {AGE_YEARS.map((year) => (
                    <Picker.Item key={year} label={year} value={year} color="#000" />
                  ))}
                </Picker>
              </View>
            </View>

            {/* STATUS */}
            {renderFullWidthOptions('Status', 'status', STATUS_OPTIONS)}

            {/* DISEASE - Conditional */}
            {['Diseased', 'Infected (Early Stage)', 'Infected (Severe)'].includes(
              treeData.status
            ) && renderFullWidthOptions('Disease', 'diseases', DISEASES)}

            {/* PLANTING DATE */}
            {renderCalendarPicker('Planting Date', 'plantingDate')}

            {/* HEIGHT */}
            {renderNumericInput('Height (m)', 'height')}

            {/* TRUNK CIRCUMFERENCE */}
            {renderNumericInput('Trunk Circumference (cm)', 'trunkCircumference')}

            {/* PALM VARIETY - Read-only from Block */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Palm Variety</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={treeData.variety}
                editable={false}
              />
            </View>

            {/* HEALTH SCORE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Health Score (%)</Text>
              <View style={styles.clearSelectedBox}>
                <Text style={styles.clearSelectedText}>
                  {treeData.healthScore || 'No score selected'}
                </Text>
              </View>
              <View style={styles.pickerContainerLarge}>
                <Picker
                  selectedValue={treeData.healthScore}
                  onValueChange={(value) => handleInputChange('healthScore', value)}
                >
                  <Picker.Item label="Scroll to select score" value="" />
                  {HEALTH_SCORES.map((score) => (
                    <Picker.Item key={score} label={score} value={score} color="#000" />
                  ))}
                </Picker>
              </View>
            </View>

            {/* ESTIMATED YIELD */}
            {renderNumericInput('Estimated Yield (tons)', 'estimatedYield')}

          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleAddTree}>
            <Text style={styles.submitButtonText}>Add Tree</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A237E' },
  placeholder: { width: 40 },
  keyboardView: { flex: 1 },
  form: { padding: 24 },
  inputGroup: { marginBottom: 24 },
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
  footer: { padding: 24, backgroundColor: '#FFF' },
  submitButton: {
    height: 52,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
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
  centerContent: { alignItems: 'center', justifyContent: 'center' },
  centerText: { fontSize: 16, fontWeight: '500' },
});

import { IconSymbol } from '@/components/ui/icon-symbol';
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
    blockName: '',
    blockNumber: '',
    phase: parsedPhase.phaseName || '',
    areaHectare: '',
    areaAcre: '',
    treesPerHectare: '',
    totalTrees: '',
    palmVariety: '',
    plantingDate: '',
    palmAge: '',
    status: '',
    estimatedYield: '',
    soilType: '',
    drainage: '',
    slope: '',
    accessibility: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setBlockData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCreateBlock = () => {
    // Check if any field is empty
    const emptyFields = Object.entries(blockData)
      .filter(([_, value]) => !value || String(value).trim() === '')
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      Alert.alert(
        'Error',
        `Please fill in all fields. Missing: ${emptyFields.join(', ')}`
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/add-tree',
        params: {
          phaseData: JSON.stringify(parsedPhase),
          blockData: JSON.stringify(blockData),
        },
      });
    }, 1000);
  };

  const numericFields = [
    'areaHectare',
    'areaAcre',
    'treesPerHectare',
    'totalTrees',
    'palmAge',
    'estimatedYield',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron.left" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Block</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {[
              { label: 'Block Name', field: 'blockName', placeholder: 'Block A' },
              { label: 'Block Number', field: 'blockNumber', placeholder: '1' },
              { label: 'Phase', field: 'phase', placeholder: parsedPhase.phaseName || '' },
              { label: 'Area (hectare)', field: 'areaHectare', placeholder: '5' },
              { label: 'Area (acre)', field: 'areaAcre', placeholder: '12.35' },
              { label: 'Trees per Hectare', field: 'treesPerHectare', placeholder: '143' },
              { label: 'Total Trees', field: 'totalTrees', placeholder: '715' },
              { label: 'Palm Variety', field: 'palmVariety', placeholder: 'Dura' },
              { label: 'Planting Date', field: 'plantingDate', placeholder: 'YYYY-MM-DD' },
              { label: 'Palm Age (years)', field: 'palmAge', placeholder: '3' },
              { label: 'Status', field: 'status', placeholder: 'Active' },
              { label: 'Estimated Yield (kg/ha)', field: 'estimatedYield', placeholder: '2500' },
              { label: 'Soil Type', field: 'soilType', placeholder: 'Loamy' },
              { label: 'Drainage', field: 'drainage', placeholder: 'Good' },
              { label: 'Slope', field: 'slope', placeholder: '5%' },
              { label: 'Accessibility', field: 'accessibility', placeholder: 'Easy' },
            ].map((item) => (
              <View key={item.field} style={styles.inputGroup}>
                <Text style={styles.label}>{item.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={item.placeholder}
                  value={blockData[item.field]}
                  onChangeText={(text) => handleInputChange(item.field, text)}
                  keyboardType={numericFields.includes(item.field) ? 'numeric' : 'default'}
                  placeholderTextColor="#999999"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleCreateBlock}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creating Block...' : 'Create Block'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFE' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  form: { padding: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  footer: { padding: 24, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  submitButton: { height: 52, backgroundColor: '#2E7D32', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#CCCCCC' },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

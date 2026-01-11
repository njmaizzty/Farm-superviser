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

export default function AddTreeScreen() {
  const router = useRouter();
  const { phaseData, blockData } = useLocalSearchParams();
  const parsedPhase = phaseData ? JSON.parse(phaseData as string) : {};
  const parsedBlock = blockData ? JSON.parse(blockData as string) : {};

  const [treeData, setTreeData] = useState<any>({
    treeNumber: '',
    block: parsedBlock.blockName || '',
    tagType: '',
    tagID: '',
    diseases: '',
    notes: '',
    variety: '',
    plantingDate: '',
    age: '',
    height: '',
    trunkCircumference: '',
    status: '',
    healthScore: '',
    estimatedYield: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setTreeData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddTree = () => {
    if (!treeData.treeNumber) {
      Alert.alert('Error', 'Tree Number is required.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Combine all data and go to main area page
      router.push({
        pathname: '/areas',
        params: {
          areaData: JSON.stringify({
            phase: parsedPhase,
            block: parsedBlock,
            trees: [treeData], // For multiple trees, append more here
          }),
        },
      });
    }, 1000);
  };

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
        <Text style={styles.headerTitle}>Add New Tree</Text>
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
              { label: 'Tree Number', field: 'treeNumber', placeholder: '1' },
              { label: 'Block', field: 'block', placeholder: parsedBlock.blockName || '' },
              { label: 'Tag Type', field: 'tagType', placeholder: 'Metal/Plastic' },
              { label: 'Tag ID', field: 'tagID', placeholder: 'T-001' },
              { label: 'Diseases', field: 'diseases', placeholder: 'None' },
              { label: 'Notes', field: 'notes', placeholder: 'Additional notes...' },
              { label: 'Variety', field: 'variety', placeholder: 'Dura' },
              { label: 'Planting Date', field: 'plantingDate', placeholder: 'YYYY-MM-DD' },
              { label: 'Age (years)', field: 'age', placeholder: '3' },
              { label: 'Height (cm)', field: 'height', placeholder: '250' },
              { label: 'Trunk Circumference (cm)', field: 'trunkCircumference', placeholder: '35' },
              { label: 'Status', field: 'status', placeholder: 'Active' },
              { label: 'Health Score', field: 'healthScore', placeholder: '90' },
              { label: 'Estimated Yield (kg)', field: 'estimatedYield', placeholder: '250' },
            ].map((item) => (
              <View key={item.field} style={styles.inputGroup}>
                <Text style={styles.label}>{item.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={item.placeholder}
                  value={treeData[item.field]}
                  onChangeText={(text) => handleInputChange(item.field, text)}
                  keyboardType={['age','height','trunkCircumference','healthScore','estimatedYield'].includes(item.field) ? 'numeric' : 'default'}
                  placeholderTextColor="#999999"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleAddTree}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Adding Tree...' : 'Add Tree'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...StyleSheet.flatten({
    container: { flex: 1, backgroundColor: '#F8FAFE' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5E8', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A237E' },
    placeholder: { width: 40 },
    keyboardView: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 20 },
    form: { padding: 24 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 8 },
    input: { height: 52, borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, backgroundColor: '#FFFFFF', color: '#333333' },
    footer: { padding: 24, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    submitButton: { height: 52, backgroundColor: '#2E7D32', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    submitButtonDisabled: { backgroundColor: '#CCCCCC' },
    submitButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  }),
});

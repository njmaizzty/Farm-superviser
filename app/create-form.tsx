import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function CreateFormScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if (type === 'task') {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      assignedTo: '',
      startDate: '',
      endDate: '',
      category: 'Maintenance',
      assetId: '',
    });
  } else if (type === 'worker') {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      skills: '',
      location: '',
    });
  } else if (type === 'asset') {
    setFormData({
      name: '',
      category: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      location: '',
      purchaseDate: '',
      purchasePrice: '',
    });
  } else if (type === 'area') {
    setFormData({
      phaseName: '',
      phaseNumber: '',
      description: '',
      totalArea: '',
      expectedBlocks: '',
      status: '',
      establishedDate: '',
    });
  }
}, [type]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- FIXED: handleCreatePhase ---
  const handleCreatePhase = () => {
    router.push(
      `/create-block?phaseData=${encodeURIComponent(JSON.stringify(formData))}`
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        'Success',
        `${getFormTitle()} created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFormTitle = () => {
    switch (type) {
      case 'task':
        return 'Task';
      case 'worker':
        return 'Worker';
      case 'asset':
        return 'Asset';
      case 'area':
        return 'Area';
      default:
        return 'Item';
    }
  };

  const renderTaskForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the task in detail"
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.segmentedControl}>
            {['Low', 'Medium', 'High'].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.segmentButton,
                  formData.priority === priority && styles.segmentButtonActive,
                ]}
                onPress={() => handleInputChange('priority', priority)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    formData.priority === priority && styles.segmentTextActive,
                  ]}
                >
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.segmentedControl}>
            {['Maintenance', 'Inspection', 'Treatment'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.segmentButton,
                  formData.category === category && styles.segmentButtonActive,
                ]}
                onPress={() => handleInputChange('category', category)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    formData.category === category && styles.segmentTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Assigned Worker</Text>
        <TextInput
          style={styles.input}
          placeholder="Select or enter worker name"
          value={formData.assignedTo}
          onChangeText={(text) => handleInputChange('assignedTo', text)}
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Start Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.startDate}
            onChangeText={(text) => handleInputChange('startDate', text)}
            placeholderTextColor="#999999"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>End Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.endDate}
            onChangeText={(text) => handleInputChange('endDate', text)}
            placeholderTextColor="#999999"
          />
        </View>
      </View>
    </>
  );

  const renderWorkerForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter worker's full name"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="worker@farm.com"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999999"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Position</Text>
          <TextInput
            style={styles.input}
            placeholder="Job title"
            value={formData.position}
            onChangeText={(text) => handleInputChange('position', text)}
            placeholderTextColor="#999999"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            placeholder="Department name"
            value={formData.department}
            onChangeText={(text) => handleInputChange('department', text)}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Skills</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter skills separated by commas"
          value={formData.skills}
          onChangeText={(text) => handleInputChange('skills', text)}
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Work location or area"
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
          placeholderTextColor="#999999"
        />
      </View>
    </>
  );

  const renderAssetForm = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Asset Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter asset name"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Equipment type"
            value={formData.category}
            onChangeText={(text) => handleInputChange('category', text)}
            placeholderTextColor="#999999"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Manufacturer</Text>
          <TextInput
            style={styles.input}
            placeholder="Brand name"
            value={formData.manufacturer}
            onChangeText={(text) => handleInputChange('manufacturer', text)}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Model number"
            value={formData.model}
            onChangeText={(text) => handleInputChange('model', text)}
            placeholderTextColor="#999999"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Serial Number</Text>
          <TextInput
            style={styles.input}
            placeholder="S/N"
            value={formData.serialNumber}
            onChangeText={(text) => handleInputChange('serialNumber', text)}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Where is this asset located?"
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Purchase Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.purchaseDate}
            onChangeText={(text) => handleInputChange('purchaseDate', text)}
            placeholderTextColor="#999999"
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Purchase Price</Text>
          <TextInput
            style={styles.input}
            placeholder="$0.00"
            value={formData.purchasePrice}
            onChangeText={(text) => handleInputChange('purchasePrice', text)}
            keyboardType="numeric"
            placeholderTextColor="#999999"
          />
        </View>
      </View>
    </>
  );

  const renderPhaseForm = () => (
  <>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Phase Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Phase A"
        value={formData.phaseName}
        onChangeText={(text) => handleInputChange('phaseName', text)}
        placeholderTextColor="#999999"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Phase Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="1"
        value={formData.phaseNumber}
        onChangeText={(text) => handleInputChange('phaseNumber', text)}
        keyboardType="numeric"
        placeholderTextColor="#999999"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description of the phase"
        value={formData.description}
        onChangeText={(text) => handleInputChange('description', text)}
        multiline
        numberOfLines={4}
        placeholderTextColor="#999999"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Total Area (hectares)</Text>
      <TextInput
        style={styles.input}
        placeholder="25.5"
        value={formData.totalArea}
        onChangeText={(text) => handleInputChange('totalArea', text)}
        keyboardType="numeric"
        placeholderTextColor="#999999"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Expected Blocks</Text>
      <TextInput
        style={styles.input}
        placeholder="5"
        value={formData.expectedBlocks}
        onChangeText={(text) => handleInputChange('expectedBlocks', text)}
        keyboardType="numeric"
        placeholderTextColor="#999999"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        placeholder="Active / Inactive"
        value={formData.status}
        onChangeText={(text) => handleInputChange('status', text)}
        placeholderTextColor="#999999"
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Established Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={formData.establishedDate}
        onChangeText={(text) => handleInputChange('establishedDate', text)}
        placeholderTextColor="#999999"
      />
    </View>
  </>
);

        // Submit Button
        return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {type === 'task' && renderTaskForm()}
            {type === 'worker' && renderWorkerForm()}
            {type === 'asset' && renderAssetForm()}
            {type === 'area' && renderPhaseForm()}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={type === 'area' ? handleCreatePhase : handleSubmit} // Use correct handler
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? `Creating ${getFormTitle()}...` : `Create ${getFormTitle()}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
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
  textArea: {
    height: 100,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#2E7D32',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitButton: {
    height: 52,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

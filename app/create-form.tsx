import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'purchaseDate' | 'establishedDate' | null>(null);

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
      position: 'Field Worker',
      skills: '',
      location: 'Phase A',
      remarks: '',
    });
  } else if (type === 'asset') {
    setFormData({
      assetName: '',
      assetId: '',
      assetType: 'Machinery',
      category: 'Field Equipment',
      status: 'Active',
      manufacturer: '',
      model: '',
      year: '2024',
      serialNumber: '',
      location: 'Block A',
      purchaseDate: '',
      purchasePrice: '',
      efficiency: '90%',
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

  const POSITIONS = ['Field Worker', 'Technician', 'Harvester'];
  const LOCATIONS = ['Block A', 'Block B', 'Block C', 'Block D'];

const renderWorkerForm = () => (
  <>
    {/* Name */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Worker Name </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter worker name"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
        placeholderTextColor="#999999"
      />
    </View>

    {/* Email */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="worker@email.com"
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999999"
      />
    </View>

    {/* Phone */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="012-3456789"
        value={formData.phone}
        onChangeText={(text) => handleInputChange('phone', text)}
        keyboardType="phone-pad"
        placeholderTextColor="#999999"
      />
    </View>

    {/* Position – Vertical Select */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>Position</Text>

  <View style={styles.optionList}>
    {POSITIONS.map((pos) => (
      <TouchableOpacity
        key={pos}
        style={[
          styles.optionButton,
          formData.position === pos && styles.optionButtonActive,
        ]}
        onPress={() => handleInputChange('position', pos)}
      >
        <Text
          style={[
            styles.optionText,
            formData.position === pos && styles.optionTextActive,
          ]}
        >
          {pos}
        </Text>
      </TouchableOpacity>
    ))}
  </View>

  {formData.position ? (
    <Text style={styles.selectedText}>
      Selected Position: {formData.position}
    </Text>
  ) : null}
</View>

    {/* Skills */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Skills</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. spraying, harvesting, machinery"
        value={formData.skills}
        onChangeText={(text) => handleInputChange('skills', text)}
        placeholderTextColor="#999999"
      />
    </View>

    {/* Location – Vertical Select */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>Location</Text>

  <View style={styles.optionList}>
    {LOCATIONS.map((loc) => (
      <TouchableOpacity
        key={loc}
        style={[
          styles.optionButton,
          formData.location === loc && styles.optionButtonActive,
        ]}
        onPress={() => handleInputChange('location', loc)}
      >
        <Text
          style={[
            styles.optionText,
            formData.location === loc && styles.optionTextActive,
          ]}
        >
          {loc}
        </Text>
      </TouchableOpacity>
    ))}
  </View>

  {formData.location ? (
    <Text style={styles.selectedText}>
      Selected Location: {formData.location}
    </Text>
  ) : null}
</View>

    {/* Remarks */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Additional notes about the worker"
        value={formData.remarks}
        onChangeText={(text) => handleInputChange('remarks', text)}
        multiline
        numberOfLines={3}
        placeholderTextColor="#999999"
      />
    </View>
  </>
);

const ASSET_TYPES = ['Machinery', 'Vehicle', 'Tool', 'Electrical'];
const ASSET_CATEGORIES = ['Field Equipment', 'Transport', 'Processing'];
const ASSET_STATUS = ['Active', 'Maintenance Required', 'Out of Service'];
const ASSET_LOCATIONS = ['Block A', 'Block B', 'Block C', 'Block D'];
const ASSET_EFFICIENCY = Array.from({ length: 101 }, (_, i) => `${100 - i}%`);
const ASSET_YEARS = Array.from({ length: 25 }, (_, i) => `${2025 - i}`);

  const renderAssetForm = () => (
  <>
    {/* Asset Name */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Asset Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Tractor"
        placeholderTextColor="#999999"
        value={formData.assetName}
        onChangeText={(text) => handleInputChange('assetName', text)}
      />
    </View>

    {/* Asset ID */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Asset ID </Text>
      <TextInput
        style={styles.input}
        placeholder="AST-001"
        placeholderTextColor="#999999"
        value={formData.assetId}
        onChangeText={(text) => handleInputChange('assetId', text)}
      />
    </View>

    {/* Asset Type */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Asset Type</Text>
      <View style={styles.optionList}>
        {ASSET_TYPES.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              formData.assetType === item && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('assetType', item)}
          >
            <Text
              style={[
                styles.optionText,
                formData.assetType === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedText}>Selected: {formData.assetType}</Text>
    </View>

    {/* Category */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.optionList}>
        {ASSET_CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              formData.category === item && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('category', item)}
          >
            <Text
              style={[
                styles.optionText,
                formData.category === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedText}>Selected: {formData.category}</Text>
    </View>

    {/* Status */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Status</Text>
      <View style={styles.optionList}>
        {ASSET_STATUS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              formData.status === item && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('status', item)}
          >
            <Text
              style={[
                styles.optionText,
                formData.status === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedText}>Selected: {formData.status}</Text>
    </View>

    {/* Manufacturer */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Manufacturer</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. John Deere"
        placeholderTextColor="#999999"
        value={formData.manufacturer}
        onChangeText={(text) => handleInputChange('manufacturer', text)}
      />
    </View>

    {/* Model */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Model</Text>
      <TextInput
        style={styles.input}
        placeholder="Model number"
        placeholderTextColor="#999999"
        value={formData.model}
        onChangeText={(text) => handleInputChange('model', text)}
      />
    </View>

    {/* Year */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>Year</Text>

  {/* CLEAR SELECTED DISPLAY */}
  <View style={styles.clearSelectedBox}>
    <Text style={styles.clearSelectedText}>
      {formData.year || 'No year selected'}
    </Text>
  </View>

  {/* SCROLL PICKER */}
  <View style={styles.pickerContainerLarge}>
    <Picker
      selectedValue={formData.year}
      onValueChange={(value) => handleInputChange('year', value)}
      dropdownIconColor="#2E7D32"
    >
      <Picker.Item label="Scroll to select year" value="" />
      {ASSET_YEARS.map((year) => (
        <Picker.Item
          key={year}
          label={year}
          value={year}
          color="#000000"   // 🔴 IMPORTANT
        />
      ))}
    </Picker>
  </View>
</View>

    {/* Serial Number */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Serial Number</Text>
      <TextInput
        style={styles.input}
        placeholder="S/N"
        placeholderTextColor="#999999"
        value={formData.serialNumber}
        onChangeText={(text) => handleInputChange('serialNumber', text)}
      />
    </View>

    {/* Location */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Location</Text>
      <View style={styles.optionList}>
        {ASSET_LOCATIONS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionButton,
              formData.location === item && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('location', item)}
          >
            <Text
              style={[
                styles.optionText,
                formData.location === item && styles.optionTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedText}>Selected: {formData.location}</Text>
    </View>

    {/* Purchase Date (Calendar-ready placeholder) */}
    <View style={styles.inputGroup}>
  <Text style={styles.label}>Purchase Date</Text>

  <TouchableOpacity
    style={[styles.input, styles.centerContent]}
    onPress={() => setShowDatePicker(true)}
    activeOpacity={0.8}
  >
    <Text
      style={[
        styles.centerText,
        { color: formData.purchaseDate ? '#333' : '#999' },
      ]}
    >
      {formData.purchaseDate || 'Tap to select date'}
    </Text>
  </TouchableOpacity>

  {showDatePicker && (
    <DateTimePicker
      value={
        formData.purchaseDate
          ? new Date(formData.purchaseDate)
          : new Date()
      }
      mode="date"
      display="default"
      onChange={(event, date) => {
        setShowDatePicker(false);
        if (date) {
          handleInputChange(
            'purchaseDate',
            date.toISOString().split('T')[0]
          );
        }
      }}
    />
  )}
</View>

    {/* Purchase Price */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>Purchase Price</Text>
  <TextInput
    style={styles.input}
    keyboardType="numeric"
    value={`RM ${formData.purchasePrice || ''}`} // RM always appears
    onChangeText={(text) => {
      // Remove the "RM " prefix before storing the number
      const numericText = text.replace(/^RM\s?/, '');
      handleInputChange('purchasePrice', numericText);
    }}
  />
</View>

    {/* Efficiency */}
<View style={styles.inputGroup}>
  <Text style={styles.label}>Efficiency</Text>

  {/* CLEAR SELECTED DISPLAY */}
  <View style={styles.clearSelectedBox}>
    <Text style={styles.clearSelectedText}>
      {formData.efficiency || 'No efficiency selected'}
    </Text>
  </View>

  {/* SCROLL PICKER */}
  <View style={styles.pickerContainerLarge}>
    <Picker
      selectedValue={formData.efficiency}
      onValueChange={(value) => handleInputChange('efficiency', value)}
      dropdownIconColor="#2E7D32"
    >
      <Picker.Item label="Scroll to select efficiency" value="" />
      {ASSET_EFFICIENCY.map((eff) => (
        <Picker.Item
          key={eff}
          label={eff}
          value={eff}
          color="#000000"   // 🔴 IMPORTANT
        />
      ))}
    </Picker>
  </View>
</View>
  </>
);

const PHASE_NAMES = ['Phase A', 'Phase B', 'Phase C', 'Phase D', 'Phase E', 'Phase F'];
const PHASE_NUMBERS = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
const EXPECTED_BLOCKS = Array.from({ length: 100 }, (_, i) => `${i + 1}`);
const PHASE_STATUS = ['Active', 'Maintenance', 'Development'];

  const renderPhaseForm = () => (
  <>
    {/* Phase Name */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Phase Name </Text>

      <View style={styles.clearSelectedBox}>
        <Text style={styles.clearSelectedText}>
          {formData.phaseName || 'No phase selected'}
        </Text>
      </View>

      <View style={styles.pickerContainerLarge}>
        <Picker
          selectedValue={formData.phaseName}
          onValueChange={(value) => handleInputChange('phaseName', value)}
        >
          <Picker.Item label="Scroll to select phase" value="" />
          {PHASE_NAMES.map((phase) => (
            <Picker.Item key={phase} label={phase} value={phase} color="#000" />
          ))}
        </Picker>
      </View>
    </View>

    {/* Phase Number */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Phase Number </Text>

      <View style={styles.clearSelectedBox}>
        <Text style={styles.clearSelectedText}>
          {formData.phaseNumber || 'No number selected'}
        </Text>
      </View>

      <View style={styles.pickerContainerLarge}>
        <Picker
          selectedValue={formData.phaseNumber}
          onValueChange={(value) => handleInputChange('phaseNumber', value)}
        >
          <Picker.Item label="Scroll to select number" value="" />
          {PHASE_NUMBERS.map((num) => (
            <Picker.Item key={num} label={num} value={num} color="#000" />
          ))}
        </Picker>
      </View>
    </View>

    {/* Expected Blocks */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Expected Number Of Blocks</Text>

      <View style={styles.clearSelectedBox}>
        <Text style={styles.clearSelectedText}>
          {formData.expectedBlocks || 'No blocks selected'}
        </Text>
      </View>

      <View style={styles.pickerContainerLarge}>
        <Picker
          selectedValue={formData.expectedBlocks}
          onValueChange={(value) => handleInputChange('expectedBlocks', value)}
        >
          <Picker.Item label="Scroll to select blocks" value="" />
          {EXPECTED_BLOCKS.map((num) => (
            <Picker.Item key={num} label={num} value={num} color="#000" />
          ))}
        </Picker>
      </View>
    </View>

    {/* Status */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Status</Text>

      <View style={styles.optionList}>
        {PHASE_STATUS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.optionButton,
              formData.status === status && styles.optionButtonActive,
            ]}
            onPress={() => handleInputChange('status', status)}
          >
            <Text
              style={[
                styles.optionText,
                formData.status === status && styles.optionTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {formData.status && (
        <Text style={styles.selectedText}>
          Selected: {formData.status}
        </Text>
      )}
    </View>

    {/* Established Date */}
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Established Date</Text>

      <TouchableOpacity
  style={[styles.input, styles.centerContent]}
  onPress={() => setShowDatePicker(true)}
  activeOpacity={0.8}
>
  <Text
    style={[
      styles.centerText,
      { color: formData.establishedDate ? '#333' : '#999' },
    ]}
  >
    {formData.establishedDate || 'Tap to select date'}
  </Text>
</TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={
            formData.establishedDate
              ? new Date(formData.establishedDate)
              : new Date()
          }
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              handleInputChange(
                'establishedDate',
                date.toISOString().split('T')[0]
              );
            }
          }}
        />
      )}
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
  optionList: {
  gap: 10,
},

optionButton: {
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#E0E0E0',
  backgroundColor: '#FFFFFF',
},

optionButtonActive: {
  backgroundColor: '#2E7D32',
  borderColor: '#2E7D32',
},

optionText: {
  fontSize: 16,
  color: '#333333',
  fontWeight: '500',
},

optionTextActive: {
  color: '#FFFFFF',
},

selectedText: {
  marginTop: 8,
  fontSize: 14,
  color: '#2E7D32',
  fontWeight: '600',
},
clearSelectedBox: {
  backgroundColor: '#2E7D32',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 10,
},

clearSelectedText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#FFFFFF',   // 🔥 HIGH CONTRAST
},

pickerContainerLarge: {
  borderWidth: 2,
  borderColor: '#2E7D32',
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  height: 200,
  justifyContent: 'center',
},
centerContent: {
  justifyContent: 'center',
  alignItems: 'center',
},

centerText: {
  fontSize: 16,
  fontWeight: '500',
},
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    height: 52,
    paddingHorizontal: 12,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  currencyTextInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333333',
    padding: 0,
  },
});

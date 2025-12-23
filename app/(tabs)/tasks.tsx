import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const { width } = Dimensions.get('window');

// Mock data for tasks
const mockTasks = [
  {
    id: '1',
    title: 'Tree Pruning - Block A',
    description: 'Prune apple trees in the northern section of Block A',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'John Smith',
    assignedToId: 'worker1',
    startDate: '2024-11-29',
    endDate: '2024-12-01',
    progress: 65,
    assetId: 'asset1',
    assetName: 'Pruning Shears Set',
    category: 'Maintenance',
    area: 'Block A',
  },
  {
    id: '2',
    title: 'Irrigation System Check',
    description: 'Inspect and test all irrigation lines in Block B',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'Maria Garcia',
    assignedToId: 'worker2',
    startDate: '2024-12-02',
    endDate: '2024-12-03',
    progress: 0,
    assetId: 'asset2',
    assetName: 'Irrigation Controller',
    category: 'Inspection',
    area: 'Block B',
  },
  {
    id: '3',
    title: 'Pest Control - Block C',
    description: 'Spray pesticides to control pests in Block C',
    status: 'Pending',
    priority: 'High',
    assignedTo: 'Ahmad',
    assignedToId: 'w1',
    startDate: '2024-12-04',
    endDate: '2024-12-05',
    progress: 0,
    assetId: 'asset3',
    assetName: 'Sprayer',
    category: 'Pest & Disease',
    area: 'Block C',
  },
  {
    id: '4',
    title: 'Fertilizer Application - Block D',
    description: 'Apply organic fertilizer to trees in Block D',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'Siti',
    assignedToId: 'w3',
    startDate: '2024-12-05',
    endDate: '2024-12-06',
    progress: 40,
    assetId: 'asset4',
    assetName: 'Fertilizer Spreaders',
    category: 'Manuring',
    area: 'Block D',
  },
];

// Mock data for workers
const workers = [
  { id: 'w1', name: 'Ahmad', expertise: ['Harvesting', 'Pruning'], availability: 'Available', experience: '5 years' },
  { id: 'w2', name: 'Faiz', expertise: ['Harvesting'], availability: 'Available', experience: '3 years' },
  { id: 'w3', name: 'Siti', expertise: ['Spraying', 'Manuring'], availability: 'Busy', experience: '4 years' },
  { id: 'w4', name: 'Ali', expertise: ['Weeding', 'Pest & Disease'], availability: 'Available', experience: '2 years' },
  { id: 'w5', name: 'Hana', expertise: ['Mechanisation Fleet'], availability: 'Available', experience: '6 years' },
];

// Task types
const TASK_TYPES = ['Harvesting', 'Pruning', 'Spraying', 'Manuring', 'Weeding', 'Pest & Disease', 'Mechanisation Fleet'];

// Area/Blocks
const AREAS = ['Block A', 'Block B', 'Block C', 'Block D'];

export default function TasksScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [taskType, setTaskType] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [area, setArea] = useState('');
  const [recommendedWorkers, setRecommendedWorkers] = useState<any[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<any[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]); // NEW: For tasks in modal

  const filters = ['All', 'Pending', 'In Progress', 'Completed'];

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || task.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Status & Priority colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#4CAF50';
      case 'In Progress': return '#2196F3';
      case 'Pending': return '#FF9800';
      default: return '#666666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#F44336';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return '#666666';
    }
  };

  // Task selection handler
  const handleTaskTypeSelect = (type: string) => {
    setTaskType(type);
    setRecommendedWorkers(workers.filter(w => w.expertise.includes(type)));
  };

  // Worker selection handler (single worker at a time)
  const toggleWorkerSelection = (worker: any) => {
    setSelectedWorkers([worker]);
    setRecommendedWorkers([]); // hide recommendations after selecting one
  };

  // Assign Task (inside modal)
  const handleAssignTask = () => {
    if (!taskType || !priority || !startDate || !endDate || !area || selectedWorkers.length === 0) {
      Alert.alert('Error', 'Please complete all task details and select at least one worker.');
      return;
    }

    const newAssignedTasks = selectedWorkers.map(worker => ({
      id: `${tasks.length + assignedTasks.length + 1}-${worker.id}`,
      taskType,
      priority,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      area,
      worker,
    }));

    setAssignedTasks([...assignedTasks, ...newAssignedTasks]);

    // Reset form for next assignment
    setTaskType('');
    setPriority('Medium');
    setStartDate(null);
    setEndDate(null);
    setArea('');
    setSelectedWorkers([]);
  };

  // Render Task Card
  const renderTaskCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.taskCard} onPress={() => router.push(`/task-details?taskId=${item.id}`)}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleRow}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.taskDetails}>
        <View style={styles.taskDetailRow}>
          <IconSymbol name="person.fill" size={16} color="#666666" />
          <Text style={styles.taskDetailText}>{item.assignedTo}</Text>
        </View>
        <View style={styles.taskDetailRow}>
          <IconSymbol name="house.fill" size={16} color="#666666" />
          <Text style={styles.taskDetailText}>{item.area || ''}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
            <IconSymbol name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol
            name="search"
            size={20}
            color="#666666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks, workers, or areas..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
            {/* House Icon on the right */}
          <IconSymbol
            name="house.fill"
            size={20}
            color="#666666"
            style={styles.searchHouseIcon}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, selectedFilter === filter && styles.filterTabActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTaskCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Task Modal */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>Create & Assign Task</Text>

            {/* Task Type */}
            <Text style={styles.label}>Task Type</Text>
            <View style={styles.taskTypeContainer}>
              {TASK_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.taskTypeButton, taskType === type && styles.taskTypeButtonActive]}
                  onPress={() => handleTaskTypeSelect(type)}
                >
                  <Text style={[styles.taskTypeText, taskType === type && { color: '#FFFFFF' }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recommended Workers */}
            {recommendedWorkers.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recommended Workers</Text>
                {recommendedWorkers.map(worker => (
                  <TouchableOpacity
                    key={worker.id}
                    style={[styles.workerCard, selectedWorkers.find(w => w.id === worker.id) && styles.workerCardSelected]}
                    onPress={() => toggleWorkerSelection(worker)}
                  >
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerDetails}>Availability: {worker.availability}</Text>
                    <Text style={styles.workerDetails}>Experience: {worker.experience}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Priority */}
            <Text style={styles.label}>Priority</Text>
            <View style={styles.taskTypeContainer}>
              {['Low', 'Medium', 'High'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.taskTypeButton, priority === p && styles.taskTypeButtonActive]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.taskTypeText, priority === p && { color: '#FFFFFF' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Start & End Date */}
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => setShowStartDatePicker(true)}>
              <Text>{startDate ? startDate.toDateString() : 'Select Start Date'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showStartDatePicker}
              mode="date"
              onConfirm={(date) => { setStartDate(date); setShowStartDatePicker(false); }}
              onCancel={() => setShowStartDatePicker(false)}
            />

            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => setShowEndDatePicker(true)}>
              <Text>{endDate ? endDate.toDateString() : 'Select End Date'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showEndDatePicker}
              mode="date"
              onConfirm={(date) => { setEndDate(date); setShowEndDatePicker(false); }}
              onCancel={() => setShowEndDatePicker(false)}
            />

            {/* Area / Block */}
            <Text style={styles.label}>Area / Block</Text>
            <View style={styles.taskTypeContainer}>
              {AREAS.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[styles.taskTypeButton, area === a && styles.taskTypeButtonActive]}
                  onPress={() => setArea(a)}
                >
                  <Text style={[styles.taskTypeText, area === a && { color: '#FFFFFF' }]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Assign Task Button */}
            <TouchableOpacity style={styles.assignButton} onPress={handleAssignTask}>
              <Text style={styles.assignButtonText}>Assign Task</Text>
            </TouchableOpacity>

            {/* Assigned Tasks Cards */}
            {assignedTasks.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Assigned Tasks</Text>
                {assignedTasks.map((assigned) => (
                  <View key={assigned.id} style={styles.assignedWorkerBox}>
                    <Text>Task Type: {assigned.taskType}</Text>
                    <Text>Priority: {assigned.priority}</Text>
                    <Text>Start Date: {new Date(assigned.startDate).toDateString()}</Text>
                    <Text>End Date: {new Date(assigned.endDate).toDateString()}</Text>
                    <Text>Area/Block: {assigned.area}</Text>
                    <Text>Worker: {assigned.worker.name}</Text>
                  </View>
                ))}

                {/* Confirm All Button */}
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() => {
                    setTasks([...assignedTasks.map(a => ({
                      id: a.id,
                      title: `${a.taskType} - ${a.area}`,
                      description: '',
                      status: 'Pending',
                      priority: a.priority,
                      assignedTo: a.worker.name,
                      assignedToId: a.worker.id,
                      startDate: a.startDate,
                      endDate: a.endDate,
                      progress: 0,
                      assetId: '',
                      assetName: '',
                      category: a.taskType,
                      area: a.area,
                    })), ...tasks]);
                    setAssignedTasks([]);
                    setShowCreateModal(false);

                    // Access Alert 
                    Alert.alert(
                      'Success',
                      'Workers assigned successfully!',
                      [{text: 'OK'}]
                    );
                  }}

                >

          
              
                  <Text style={styles.assignButtonText}>Confirm All</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Cancel */}
            <TouchableOpacity
              style={[styles.assignButton, { backgroundColor: '#CCCCCC', marginTop: 10 }]}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.assignButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// STYLES //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFE',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
  },

  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchContainer: {
    position: 'relative',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginBottom: 8,
  },
  searchHouseIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
},
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  searchInput: {
    paddingLeft: 40,
    paddingRight: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },

  filterContainer: {
    marginBottom: 8,
  },

  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },

  filterTabActive: {
    backgroundColor: '#2E7D32',
  },

  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  listContainer: {
    padding: 24,
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  taskTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    flex: 1,
    marginRight: 8,
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  taskDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  taskDetailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFE',
  },

  modalContent: {
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A237E',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },

  taskTypeContainer: {
    flexDirection: 'column',
    marginBottom: 12,
  },

  taskTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 8,
  },

  taskTypeButtonActive: {
    backgroundColor: '#2E7D32',
  },

  taskTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#1A237E',
  },

  workerCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  workerCardSelected: {
    borderColor: '#2E7D32',
    borderWidth: 2,
  },

  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A237E',
  },

  workerDetails: {
    fontSize: 14,
    color: '#666666',
  },

  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
  },

  summaryBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  assignButton: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  assignedWorkerBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

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
    {
    id: '5',
    title: 'Harvest Loose Fruits - Block B',
    description: 'Collect loose fruits from Block B',
    status: 'Completed',
    priority: 'Medium',
    assignedTo: 'Faiz',
    assignedToId: 'w2',
    startDate: '2024-11-25',
    endDate: '2024-11-26',
    progress: 100,
    assetId: 'asset2',
    assetName: 'Harvest Basket',
    category: 'Harvesting',
    area: 'Block B',
  },
  {
    id: '6',
    title: 'Weeding - Block D',
    description: 'Complete weeding of paths in Block D',
    status: 'Completed',
    priority: 'Low',
    assignedTo: 'Imran',
    assignedToId: 'w8',
    startDate: '2024-11-20',
    endDate: '2024-11-21',
    progress: 100,
    assetId: '',
    assetName: '',
    category: 'Weeding',
    area: 'Block D',
  },
];

// Mock data for workers with AI suitability scores
const workers = [
  { id: 'w1', name: 'Ahmad', expertise: ['Harvesting', 'Pruning'], availability: 'Available', experience: 5, suitabilityScore: 92, currentTasks: ['Harvesting section A'] },
  { id: 'w2', name: 'Faiz', expertise: ['Harvesting'], availability: 'Available', experience: 3, suitabilityScore: 84, currentTasks: ['Harvesting section B'] },
  { id: 'w3', name: 'Siti', expertise: ['Spraying', 'Manuring'], availability: 'Busy', experience: 4, suitabilityScore: 90, currentTasks: ['Spraying section C'] },
  { id: 'w4', name: 'Ali', expertise: ['Weeding', 'Pest & Disease'], availability: 'Available', experience: 2, suitabilityScore: 82, currentTasks: ['Weeding section D'] },
  { id: 'w5', name: 'Hana', expertise: ['Mechanisation Fleet'], availability: 'Available', experience: 6, suitabilityScore: 91, currentTasks: ['Tractor maintenance'] },
  { id: 'w6', name: 'Maya', expertise: ['Pruning'], availability: 'Available', experience: 4, suitabilityScore: 88, currentTasks: ['Pruning section A'] },
  { id: 'w7', name: 'Zul', expertise: ['Manuring'], availability: 'Available', experience: 3, suitabilityScore: 85, currentTasks: ['Manuring section B'] },
  { id: 'w8', name: 'Imran', expertise: ['Weeding'], availability: 'Available', experience: 3, suitabilityScore: 82, currentTasks: [] },
  { id: 'w9', name: 'Fauzi', expertise: ['Pest & Disease'], availability: 'Available', experience: 6, suitabilityScore: 87, currentTasks: ['Pest inspection section A'] },
  { id: 'w10', name: 'Razak', expertise: ['General Work'], availability: 'Available', experience: 7, suitabilityScore: 89, currentTasks: ['Main gate security'] },
  { id: 'w11', name: 'Aisyah', expertise: ['General Work'], availability: 'Available', experience: 4, suitabilityScore: 83, currentTasks: ['Office area cleaning'] },
];

// Task types
const TASK_TYPES = [
  'General Work',
  'Harvesting',
  'Manuring',
  'Weeding',
  'Pest & Disease',
  'Mechanisation Fleet',
];

const TASK_SUBTYPES: Record<string, string[]> = {
  'General Work': [
    'Security Personnel',
    'Gardeners / Line Sweeper',
    'Mechanical Work',
    'Electrical Work',
    'Apprentice',
  ],
  'Harvesting': [
    'Harvester',
    'Loose Fruit Collection',
    'Pruning',
  ],
  'Manuring': [
    'Fertilizer Application',
    'Transporting Fertilizers',
  ],
  'Weeding': [
    'Circle / Path',
    'Selective',
    'Blanket',
  ],
  'Pest & Disease': [
    'Pest & Disease Census',
    'Pest & Disease Control',
  ],
  'Mechanisation Fleet': [
    'Badang A',
    'Badang B',
    'Badang C',
    'Tractor A',
  ],
};

// Area/Blocks
const AREAS = ['Block A', 'Block B', 'Block C', 'Block D'];

// Assets
const ASSETS = [
  { id: 'a1', name: 'Pruning Shears Set' },
  { id: 'a2', name: 'Sprayer Machine' },
  { id: 'a3', name: 'Fertilizer Spreader' },
  { id: 'a4', name: 'Tractor' },
];

// Date helper functions
const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isTomorrow = (date: Date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

const isNextWeek = (date: Date) => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return date.toDateString() === nextWeek.toDateString();
};

const isSameDay = (date1: Date | null, date2: Date | null) => {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
};

export default function TasksScreen() {
  const router = useRouter();

  const [tasks, setTasks] = useState(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [taskType, setTaskType] = useState('');
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [area, setArea] = useState('');
  const [recommendedWorkers, setRecommendedWorkers] = useState<any[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<any[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]); // NEW: For tasks in modal
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [activeEndDate, setActiveEndDate] = useState<string | null>(null);
  const [taskSubType, setTaskSubType] = useState('');

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

  // Task selection handler - filters and sorts workers by AI suitability
  const handleTaskTypeSelect = (type: string) => {
    setTaskType(type);
    setTaskSubType('');

    const matchingWorkers = workers
      .filter(w => w.expertise.includes(type))
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    setRecommendedWorkers(matchingWorkers);
    setSelectedWorkers([]);
  };

  // Worker selection handler (single worker at a time)
  const toggleWorkerSelection = (worker: any) => {
    // Toggle selection - if already selected, deselect; otherwise select
    if (selectedWorkers.find(w => w.id === worker.id)) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers([worker]);
    }
  };

  // Assign Task - directly adds to task list
  const handleAssignTask = () => {
    console.log('handleAssignTask called');
    console.log('taskType:', taskType);
    console.log('selectedWorkers:', selectedWorkers);
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('area:', area);
    
    // Validation
    if (!taskSubType) {
      Alert.alert('Missing Info', 'Please select a task detail.');
      return;
    }
    if (selectedWorkers.length === 0) {
      Alert.alert('Missing Info', 'Please select a worker.');
      return;
    }
    if (!startDate) {
      Alert.alert('Missing Info', 'Please select a start date.');
      return;
    }
    if (!endDate) {
      Alert.alert('Missing Info', 'Please select an end date.');
      return;
    }
    if (!area) {
      Alert.alert('Missing Info', 'Please select an area/block.');
      return;
    }
    if (!selectedAsset) {
      Alert.alert('Missing Info', 'Please select an asset/equipment.');
      return;
    } 

    const worker = selectedWorkers[0];
    const newTask = {
      id: String(Date.now()),
      title: `${taskType} - ${taskSubType} - ${area}`,
      description: `Assigned to ${worker.name}`,
      status: 'Pending',
      priority: priority,
      assignedTo: worker.name,
      assignedToId: worker.id,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      progress: 0,
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      category: taskType,
      area: area,
    };

    console.log('Creating new task:', newTask);
    console.log('Current tasks count:', tasks.length);

    // Update tasks state with new task at the beginning
    const updatedTasks = [newTask, ...tasks];
    console.log('Updated tasks count:', updatedTasks.length);
    
    setTasks(updatedTasks);

    // Reset form
    setTaskType('');
    setPriority('Medium');
    setStartDate(null);
    setEndDate(null);
    setArea('');
    setSelectedWorkers([]);
    setRecommendedWorkers([]);
    setSelectedAsset(null);
    setActiveEndDate('sameDay');
    setActiveEndDate('plus3');
    setActiveEndDate('plus7');

    
    // Close modal
    setShowCreateModal(false);
    
    // Show success message after a small delay to ensure state updates
    setTimeout(() => {
      Alert.alert('Success', `Task "${newTask.title}" assigned to ${worker.name}!`);
    }, 100);
  };

  // Confirm all assignments and add to task list
  const handleConfirmAllAssignments = () => {
    if (assignedTasks.length === 0) {
      Alert.alert('No Tasks', 'Please add tasks to the queue first.');
      return;
    }

    const newTasks = assignedTasks.map(a => ({
      id: a.id,
      title: `${a.taskType} - ${a.area}`,
      description: `Assigned to ${a.worker.name}`,
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
      subCategory: taskSubType,
      area: a.area,
    }));

    // Update tasks list with new tasks at the top
    setTasks(prevTasks => [...newTasks, ...prevTasks]);
    
    // Reset everything
    setAssignedTasks([]);
    setShowCreateModal(false);
    setTaskType('');
    setPriority('Medium');
    setStartDate(null);
    setEndDate(null);
    setArea('');
    setSelectedWorkers([]);
    setRecommendedWorkers([]);

    Alert.alert(
      'Success',
      `${newTasks.length} task(s) assigned successfully!`,
      [{text: 'OK'}]
    );
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
            placeholder="Search tasks, workers, or areas"
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
        extraData={tasks}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Task Modal */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            {/* Header with close button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create & Assign Task</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCreateModal(false)}
              >
                <IconSymbol name="chevron.left" size={24} color="#666" />
              </TouchableOpacity>
            </View>

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

            {/* Task Detail */}
            {taskType && TASK_SUBTYPES[taskType] && (
           <>
              <Text style={styles.label}>Task Detail</Text>
                <View style={styles.taskTypeContainer}>
          {TASK_SUBTYPES[taskType].map(sub => (
              <TouchableOpacity
          key={sub}
          style={[
            styles.taskTypeButton,
            taskSubType === sub && styles.taskTypeButtonActive,
          ]}
          onPress={() => setTaskSubType(sub)}
        >
          <Text
            style={[
              styles.taskTypeText,
              taskSubType === sub && { color: '#FFFFFF' },
            ]}
          >
            {sub}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </>
)}

            {/* AI Recommended Workers */}
            {recommendedWorkers.length > 0 && (
              <View style={styles.aiSection}>
                <View style={styles.aiHeader}>
                  <View style={styles.aiIconContainer}>
                    <IconSymbol name="brain.head.profile" size={20} color="#9C27B0" />
                  </View>
                  <View>
                    <Text style={styles.aiTitle}>AI Recommended Workers</Text>
                    <Text style={styles.aiSubtitle}>
                      Based on skills, availability & performance
                    </Text>
                  </View>
                </View>
                
                {recommendedWorkers.map((worker, index) => (
                  <TouchableOpacity
                    key={worker.id}
                    style={[
                      styles.aiWorkerCard, 
                      selectedWorkers.find(w => w.id === worker.id) && styles.aiWorkerCardSelected,
                      index === 0 && styles.topRecommendation
                    ]}
                    onPress={() => toggleWorkerSelection(worker)}
                  >
                    <View style={styles.workerCardHeader}>
                      <View style={styles.workerNameRow}>
                        <Text style={styles.workerName}>{worker.name}</Text>
                        {index === 0 && (
                          <View style={styles.topBadge}>
                            <Text style={styles.topBadgeText}>Top Match</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>Match</Text>
                        <Text style={styles.scoreValue}>{worker.suitabilityScore}%</Text>
                      </View>
                    </View>
                    
                    <View style={styles.workerMetrics}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Availability</Text>
                        <Text style={[
                          styles.metricValue,
                          { color: worker.availability === 'Available' ? '#4CAF50' : '#FF9800' }
                        ]}>
                          {worker.availability}
                        </Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Experience</Text>
                        <Text style={styles.metricValue}>{worker.experience} years</Text>
                      </View>
                    </View>
                    
                    {worker.currentTasks.length > 0 && (
                      <View style={styles.currentTasksContainer}>
                        <Text style={styles.currentTasksLabel}>Current Tasks:</Text>
                        <Text style={styles.currentTasksText}>
                          {worker.currentTasks.join(', ')}
                        </Text>
                      </View>
                    )}
                    
                    {selectedWorkers.find(w => w.id === worker.id) && (
                      <View style={styles.selectedIndicator}>
                        <IconSymbol name="checkmark.circle.fill" size={20} color="#2E7D32" />
                        <Text style={styles.selectedText}>Selected</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Selected Worker Summary */}
            {selectedWorkers.length > 0 && (
              <View style={styles.selectedWorkerSummary}>
                <Text style={styles.selectedWorkerLabel}>Assigned to:</Text>
                <Text style={styles.selectedWorkerName}>{selectedWorkers[0].name}</Text>
              </View>
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

            {/* Selected Priority */}
            {priority && (
              <View style={styles.selectedDateDisplay}>
                <IconSymbol name="flag.fill" size={16} color="#2E7D32" />
                <Text style={styles.selectedDateText}>{priority}</Text>
              </View>
            )}

            {/* Start & End Date - Quick Date Buttons */}
            <Text style={styles.label}>Start Date</Text>
            <View style={styles.dateButtonsRow}>
              <TouchableOpacity 
                style={[styles.dateQuickButton, startDate && isToday(startDate) && styles.dateQuickButtonActive]}
                onPress={() => setStartDate(new Date())}
              >
                <Text style={[styles.dateQuickButtonText, startDate && isToday(startDate) && styles.dateQuickButtonTextActive]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dateQuickButton, startDate && isTomorrow(startDate) && styles.dateQuickButtonActive]}
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setStartDate(tomorrow);
                }}
              >
                <Text style={[styles.dateQuickButtonText, startDate && isTomorrow(startDate) && styles.dateQuickButtonTextActive]}>Tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dateQuickButton, startDate && isNextWeek(startDate) && styles.dateQuickButtonActive]}
                onPress={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setStartDate(nextWeek);
                }}
              >
                <Text style={[styles.dateQuickButtonText, startDate && isNextWeek(startDate) && styles.dateQuickButtonTextActive]}>Next Week</Text>
              </TouchableOpacity>
            </View>
            {/* Display selected start date */}
            {startDate && (
              <View style={styles.selectedDateDisplay}>
                <IconSymbol name="calendar.fill" size={16} color="#2E7D32" />
                <Text style={styles.selectedDateText}>{startDate.toDateString()}</Text>
              </View>
            )}

            <Text style={styles.label}>End Date</Text>
            <View style={styles.dateButtonsRow}>
              {/* Same Day */}
              <TouchableOpacity
                style={[styles.dateQuickButton, activeEndDate === 'sameDay' && styles.dateQuickButtonActive]}
                onPress={() => {setEndDate(startDate || new Date());
                setActiveEndDate('sameDay');
             }}
            >
            <Text style={[styles.dateQuickButtonText,activeEndDate === 'sameDay' && styles.dateQuickButtonTextActive]}>
            Same Day
            </Text>
          </TouchableOpacity>

            {/* +3 Days */}
              <TouchableOpacity
                style={[styles.dateQuickButton,activeEndDate === 'plus3' && styles.dateQuickButtonActive]}
                  onPress={() => {
                    const date = startDate || new Date();
                    const newDate = new Date(date);
                    newDate.setDate(newDate.getDate() + 3);
                    setEndDate(newDate);
                    setActiveEndDate('plus3');
                }}
              >
              <Text
                style={[
                styles.dateQuickButtonText,activeEndDate === 'plus3' && styles.dateQuickButtonTextActive]}>
              +3 Days
              </Text>
                </TouchableOpacity>

            {/* +1 Week */}
              <TouchableOpacity
                style={[styles.dateQuickButton,activeEndDate === 'plus7' && styles.dateQuickButtonActive]}
                  onPress={() => {
                    const date = startDate || new Date();
                    const newDate = new Date(date);
                    newDate.setDate(newDate.getDate() + 7);
                    setEndDate(newDate);
                    setActiveEndDate('plus7');
                }}
              >
              <Text
                style={[styles.dateQuickButtonText,activeEndDate === 'plus7' && styles.dateQuickButtonTextActive]}>
             +1 Week
              </Text>
                </TouchableOpacity>
                  </View>

                  {/* Display Selected End Date */}
                  {endDate && (
                    <View style={styles.selectedDateDisplay}>
                      <IconSymbol name="calendar.fill" size={16} color="#2E7D32" />
                      <Text style={styles.selectedDateText}>{endDate.toDateString()}</Text>
                    </View>
                  )}

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

            {/* Selected Area / Block */}
            {area && (
              <View style={styles.selectedDateDisplay}>
                <IconSymbol name="house.fill" size={16} color="#2E7D32" />
                <Text style={styles.selectedDateText}>{area}</Text>
              </View>
            )}

            {/* Asset / Equipment */}
            <Text style={styles.label}>Asset / Equipment</Text>
            <View style={styles.taskTypeContainer}>
              {ASSETS.map(asset => (
                <TouchableOpacity
                  key={asset.id}
                  style={[styles.taskTypeButton,selectedAsset?.id === asset.id && styles.taskTypeButtonActive,]}
                  onPress={() => setSelectedAsset(asset)}
                >
                  <Text style={[styles.taskTypeText,selectedAsset?.id === asset.id && { color: '#FFFFFF' },]}>{asset.name}</Text>
                </TouchableOpacity>
                ))}
              </View>

              {selectedAsset && (
              <View style={styles.selectedWorkerSummary}>
              <Text style={styles.selectedWorkerLabel}>Using asset:</Text>
              <Text style={styles.selectedWorkerName}>{selectedAsset.name}</Text>
              </View>
            )}

            {/* Assign Task Button */}
            <TouchableOpacity style={styles.assignTaskButton} onPress={handleAssignTask}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#FFFFFF" />
              <Text style={styles.assignTaskButtonText}>Assign Task</Text>
            </TouchableOpacity>

            {/* Assigned Tasks Cards */}
            {assignedTasks.length > 0 && (
  <View style={styles.queueSection}>
    <View style={styles.queueHeader}>
      <Text style={styles.queueTitle}>Assignment Queue</Text>
      <View style={styles.queueBadge}>
        <Text style={styles.queueBadgeText}>{assignedTasks.length}</Text>
      </View>
    </View>

    {assignedTasks.map((assigned) => {
      // Right swipe action for delete
      const renderRightActions = () => (
        assigned.status === 'Completed' ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#F44336',
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
              borderRadius: 12,
              marginVertical: 5,
            }}
            onPress={() => {
              setAssignedTasks(prev => prev.filter(t => t.id !== assigned.id));
              Alert.alert('Deleted', `Task "${assigned.taskType}" removed.`);
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Delete</Text>
          </TouchableOpacity>
        ) : null
      );

      return (
        <Swipeable key={assigned.id} renderRightActions={renderRightActions}>
          <View style={styles.queueCard}>
            <View style={styles.queueCardHeader}>
              <Text style={styles.queueCardTitle}>{assigned.taskType}</Text>
              <View
                style={[styles.priorityBadge, { backgroundColor: getPriorityColor(assigned.priority) }]}
              >
                <Text style={styles.priorityText}>{assigned.priority}</Text>
              </View>
            </View>
            <View style={styles.queueCardDetails}>
              <View style={styles.queueDetailRow}>
                <IconSymbol name="person.fill" size={14} color="#666" />
                <Text style={styles.queueDetailText}>{assigned.worker.name}</Text>
              </View>
              <View style={styles.queueDetailRow}>
                <IconSymbol name="map.fill" size={14} color="#666" />
                <Text style={styles.queueDetailText}>{assigned.area}</Text>
              </View>
              <View style={styles.queueDetailRow}>
                <IconSymbol name="calendar.fill" size={14} color="#666" />
                <Text style={styles.queueDetailText}>
                  {new Date(assigned.startDate).toLocaleDateString()} - {new Date(assigned.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </Swipeable>
      );
    })}
  
                {/* Confirm All Button */}
                <TouchableOpacity
                  style={styles.confirmAllButton}
                  onPress={handleConfirmAllAssignments}
                >
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#FFFFFF" />
                  <Text style={styles.confirmAllButtonText}>Confirm All Assignments</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Cancel */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowCreateModal(false);
                setTaskType('');
                setPriority('Medium');
                setStartDate(null);
                setEndDate(null);
                setArea('');
                setSelectedWorkers([]);
                setRecommendedWorkers([]);
                setAssignedTasks([]);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    paddingBottom: 40,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
  },

  closeButton: {
    padding: 8,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
    color: '#333333',
  },

  taskTypeContainer: {
    flexDirection: 'column',
    marginBottom: 12,
  },

  taskTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    marginBottom: 8,
  },

  taskTypeButtonActive: {
    backgroundColor: '#2E7D32',
  },

  taskTypeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#1A237E',
  },

  // AI Recommendation Styles
  aiSection: {
    marginVertical: 16,
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CE93D8',
  },

  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
  },

  aiSubtitle: {
    fontSize: 12,
    color: '#9C27B0',
    marginTop: 2,
  },

  aiWorkerCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  aiWorkerCardSelected: {
    borderColor: '#2E7D32',
    borderWidth: 2,
    backgroundColor: '#E8F5E9',
  },

  topRecommendation: {
    borderColor: '#9C27B0',
    borderWidth: 2,
  },

  workerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  workerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A237E',
  },

  topBadge: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },

  topBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  scoreLabel: {
    fontSize: 10,
    color: '#7B1FA2',
    fontWeight: '500',
  },

  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C27B0',
  },

  workerMetrics: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  metricItem: {
    flex: 1,
  },

  metricLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },

  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  currentTasksContainer: {
    backgroundColor: '#FFF8E1',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },

  currentTasksLabel: {
    fontSize: 11,
    color: '#F57C00',
    fontWeight: '600',
  },

  currentTasksText: {
    fontSize: 12,
    color: '#E65100',
    marginTop: 2,
  },

  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  selectedText: {
    marginLeft: 6,
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },

  selectedWorkerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  selectedWorkerLabel: {
    fontSize: 14,
    color: '#2E7D32',
    marginRight: 8,
  },

  selectedWorkerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
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

  workerDetails: {
    fontSize: 14,
    color: '#666666',
  },

  datePicker: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  datePickerText: {
    fontSize: 15,
    color: '#333',
  },

  datePickerPlaceholder: {
    color: '#999',
  },

  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  datePickerDoneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    marginTop: 10,
  },

  datePickerDoneText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  dateInput: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#333',
  },

  dateButtonsRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },

  dateQuickButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    alignItems: 'center',
  },

  dateQuickButtonActive: {
    backgroundColor: '#2E7D32',
  },

  dateQuickButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  dateQuickButtonTextActive: {
    color: '#FFFFFF',
  },

  selectedDateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  selectedDateText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },

  summaryBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  assignTaskButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  assignTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Queue Section Styles
  queueSection: {
    marginTop: 24,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },

  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  queueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  queueBadge: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },

  queueBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  queueCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },

  queueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  queueCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
  },

  queueCardDetails: {
    gap: 6,
  },

  queueDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  queueDetailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },

  confirmAllButton: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  confirmAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  cancelButton: {
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  cancelButtonText: {
    color: '#666666',
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
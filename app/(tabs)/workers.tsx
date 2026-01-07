import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data for workers
const mockWorkers = [
  {
    id: 'worker1',
    name: 'John Smith',
    email: 'john.smith@farm.com',
    phone: '+60 12-176 4532',
    position: 'Field Worker',
    department: 'Plantation Operations',
    status: 'Active',
    availability: 'Available',
    hoursWorked: 42,
    tasksCompleted: 15,
    currentTasks: 2,
    skills: ['Pruning', 'Harvesting', 'Weeding'],
    joinDate: '2023-01-15',
    lastActive: '2 hours ago',
    rating: 4.8,
    location: 'Block A',
  },
  {
    id: 'worker2',
    name: 'Maria Garcia',
    email: 'maria.garcia@farm.com',
    phone: '+60 16-893 625',
    position: 'Field Worker',
    department: 'Plantation Operation',
    status: 'Active',
    availability: 'Busy',
    hoursWorked: 38,
    tasksCompleted: 12,
    currentTasks: 3,
    skills: ['Harvesting', 'Spraying'],
    joinDate: '2023-03-20',
    lastActive: '30 minutes ago',
    rating: 4.9,
    location: 'Block B',
  },
  {
    id: 'worker3',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@farm.com',
    phone: '+60 17-577 145',
    position: 'Field Worker',
    department: 'Plantation Operation',
    status: 'Active',
    availability: 'Available',
    hoursWorked: 45,
    tasksCompleted: 18,
    currentTasks: 1,
    skills: ['Pest & Disease', 'Manuring'],
    joinDate: '2022-11-10',
    lastActive: '1 hour ago',
    rating: 4.7,
    location: 'Block A',
  },
  {
    id: 'worker4',
    name: 'Ana Martinez',
    email: 'ana.martinez@farm.com',
    phone: '+60 16-761 718',
    position: 'Field Worker',
    department: 'Plantation Operation',
    status: 'Active',
    availability: 'Available',
    hoursWorked: 40,
    tasksCompleted: 14,
    currentTasks: 2,
    skills: ['Weeding', 'Harvesting', 'Pruning'],
    joinDate: '2023-05-08',
    lastActive: '15 minutes ago',
    rating: 4.6,
    location: 'Block C',
  },
  {
    id: 'worker5',
    name: 'David Wilson',
    email: 'david.wilson@farm.com',
    phone: '+60 15-142 345',
    position: 'Field Worker',
    department: 'Plantation Operation',
    status: 'On Leave',
    availability: 'Unavailable',
    hoursWorked: 0,
    tasksCompleted: 8,
    currentTasks: 0,
    skills: ['Mechanisation Fleet', 'Weeding'],
    joinDate: '2023-07-12',
    lastActive: '3 days ago',
    rating: 4.5,
    location: 'Block D',
  },
];

export default function WorkersScreen() {
  const router = useRouter();
  const [workers, setWorkers] = useState(mockWorkers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Available', 'Busy', 'Unavailable'];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || worker.availability === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return '#4CAF50';
      case 'Busy': return '#FF9800';
      case 'Unavailable': return '#F44336';
      default: return '#666666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'On Leave': return '#FF9800';
      case 'Inactive': return '#F44336';
      default: return '#666666';
    }
  };

  const handleCallWorker = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailWorker = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWorkerPress = (worker: any) => {
    Alert.alert(
      worker.name,
      `Position: ${worker.position}\nDepartment: ${worker.department}\nStatus: ${worker.status}\nLocation: ${worker.location}\n\nHours this week: ${worker.hoursWorked}\nTasks completed: ${worker.tasksCompleted}\nCurrent tasks: ${worker.currentTasks}\nRating: ${worker.rating}/5.0`,
      [
        { text: 'Call', onPress: () => handleCallWorker(worker.phone) },
        { text: 'Email', onPress: () => handleEmailWorker(worker.email) },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleAddWorker = () => {
    router.push('/create-form?type=worker');
  };

  const renderWorkerCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.workerCard} 
      onPress={() => handleWorkerPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.workerHeader}>
        <View style={styles.workerAvatar}>
          <IconSymbol name="person.fill" size={32} color="#2E7D32" />
        </View>
        <View style={styles.workerInfo}>
          <View style={styles.workerNameRow}>
            <Text style={styles.workerName}>{item.name}</Text>
            <View style={[styles.availabilityDot, { backgroundColor: getAvailabilityColor(item.availability) }]} />
          </View>
          <Text style={styles.workerPosition}>{item.position}</Text>
          <Text style={styles.workerDepartment}>{item.department}</Text>
        </View>
        <View style={styles.workerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleCallWorker(item.phone)}
            activeOpacity={0.7}
          >
            <IconSymbol name="house.fill" size={20} color="#2E7D32" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEmailWorker(item.email)}
            activeOpacity={0.7}
          >
            <IconSymbol name="envelope.fill" size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.workerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.hoursWorked}h</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.currentTasks}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.workerDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="house.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="house.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>Last active: {item.lastActive}</Text>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        <Text style={styles.skillsLabel}>Skills:</Text>
        <View style={styles.skillsList}>
          {item.skills.slice(0, 3).map((skill: string, index: number) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {item.skills.length > 3 && (
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>+{item.skills.length - 3}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.workerFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.joinDate}>Joined {item.joinDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Workers</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddWorker}
              activeOpacity={0.8}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="house.fill" 
          size={20} 
          color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workers"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Workers List */}
      <FlatList
        data={filteredWorkers}
        renderItem={renderWorkerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="person.fill" size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No workers found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Add workers to start managing your team'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

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
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
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
  workerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workerInfo: {
    flex: 1,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    marginRight: 8,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  workerPosition: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 2,
  },
  workerDepartment: {
    fontSize: 12,
    color: '#666666',
  },
  workerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
  },
  workerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
  skillsContainer: {
    marginBottom: 16,
  },
  skillsLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '500',
  },
  workerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  joinDate: {
    fontSize: 12,
    color: '#999999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

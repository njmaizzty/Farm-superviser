import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock data for areas
const mockAreas = [
  {
    id: 'area1',
    name: 'Block A - Apple Orchard',
    phaseName: 'Phase 1',
    totalArea: 25.5,
    expectedBlocks: 12,
    actualBlocks: 12,
    establishedDate: '2020-03-15',
    status: 'Active',
    supervisor: 'John Smith',
    cropType: 'Apple Trees',
    plantingDensity: 150,
    irrigationSystem: 'Drip Irrigation',
    soilType: 'Loamy',
    lastInspection: '2024-11-25',
    nextInspection: '2024-12-10',
    healthScore: 92,
    productivity: 'High',
    notes: 'Excellent growth, ready for winter pruning',
  },
  {
    id: 'area2',
    name: 'Block B - Citrus Grove',
    phaseName: 'Phase 2',
    totalArea: 18.2,
    expectedBlocks: 8,
    actualBlocks: 8,
    establishedDate: '2021-01-20',
    status: 'Active',
    supervisor: 'Maria Garcia',
    cropType: 'Citrus Trees',
    plantingDensity: 120,
    irrigationSystem: 'Sprinkler',
    soilType: 'Sandy Loam',
    lastInspection: '2024-11-20',
    nextInspection: '2024-12-05',
    healthScore: 88,
    productivity: 'High',
    notes: 'Good fruit development, monitor for pests',
  },
  {
    id: 'area3',
    name: 'Block C - Vegetable Fields',
    phaseName: 'Phase 1',
    totalArea: 32.0,
    expectedBlocks: 16,
    actualBlocks: 14,
    establishedDate: '2019-08-10',
    status: 'Maintenance',
    supervisor: 'Carlos Rodriguez',
    cropType: 'Mixed Vegetables',
    plantingDensity: 200,
    irrigationSystem: 'Drip Irrigation',
    soilType: 'Clay Loam',
    lastInspection: '2024-11-15',
    nextInspection: '2024-11-30',
    healthScore: 75,
    productivity: 'Medium',
    notes: 'Soil improvement needed, drainage issues',
  },
  {
    id: 'area4',
    name: 'Block D - Greenhouse Complex',
    phaseName: 'Phase 3',
    totalArea: 8.5,
    expectedBlocks: 4,
    actualBlocks: 4,
    establishedDate: '2022-05-12',
    status: 'Active',
    supervisor: 'Ana Martinez',
    cropType: 'Tomatoes & Peppers',
    plantingDensity: 300,
    irrigationSystem: 'Hydroponic',
    soilType: 'Controlled Medium',
    lastInspection: '2024-11-28',
    nextInspection: '2024-12-12',
    healthScore: 95,
    productivity: 'Very High',
    notes: 'Optimal conditions, excellent yield',
  },
  {
    id: 'area5',
    name: 'Block E - Experimental Plot',
    phaseName: 'Phase 2',
    totalArea: 5.0,
    expectedBlocks: 2,
    actualBlocks: 1,
    establishedDate: '2023-09-01',
    status: 'Development',
    supervisor: 'David Wilson',
    cropType: 'Research Crops',
    plantingDensity: 100,
    irrigationSystem: 'Manual',
    soilType: 'Various',
    lastInspection: '2024-11-22',
    nextInspection: '2024-12-08',
    healthScore: 70,
    productivity: 'Variable',
    notes: 'Testing new varieties and techniques',
  },
];

export default function AreasScreen() {
  const router = useRouter();
  const [areas, setAreas] = useState(mockAreas);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const filters = ['All', 'Active', 'Maintenance', 'Development'];

  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         area.phaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         area.cropType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || area.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Maintenance': return '#FF9800';
      case 'Development': return '#2196F3';
      default: return '#666666';
    }
  };

  const getProductivityColor = (productivity: string) => {
    switch (productivity) {
      case 'Very High': return '#4CAF50';
      case 'High': return '#8BC34A';
      case 'Medium': return '#FFC107';
      case 'Low': return '#FF9800';
      case 'Variable': return '#9C27B0';
      default: return '#666666';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const handleAreaPress = (area: any) => {
    Alert.alert(
      area.name,
      `Phase: ${area.phaseName}\nCrop Type: ${area.cropType}\nTotal Area: ${area.totalArea} hectares\nBlocks: ${area.actualBlocks}/${area.expectedBlocks}\nHealth Score: ${area.healthScore}%\nProductivity: ${area.productivity}\n\nSupervisor: ${area.supervisor}\nIrrigation: ${area.irrigationSystem}\nSoil Type: ${area.soilType}\n\nNotes: ${area.notes}`,
      [
        { text: 'View Blocks', onPress: () => Alert.alert('View Blocks', 'Block view functionality coming soon') },
        { text: 'Schedule Inspection', onPress: () => Alert.alert('Schedule Inspection', 'Inspection scheduling coming soon') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleAddArea = () => {
  router.push('/create-form?type=area');
};

  const renderAreaCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.areaCard} 
      onPress={() => handleAreaPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.areaHeader}>
        <View style={styles.areaIcon}>
          <IconSymbol name="map.fill" size={24} color="#2E7D32" />
        </View>
        <View style={styles.areaTitleSection}>
          <Text style={styles.areaName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.areaPhase}>{item.phaseName} • {item.cropType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.areaMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.totalArea}</Text>
          <Text style={styles.metricLabel}>Hectares</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.actualBlocks}/{item.expectedBlocks}</Text>
          <Text style={styles.metricLabel}>Blocks</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: getHealthScoreColor(item.healthScore) }]}>
            {item.healthScore}%
          </Text>
          <Text style={styles.metricLabel}>Health</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: getProductivityColor(item.productivity) }]}>
            {item.productivity}
          </Text>
          <Text style={styles.metricLabel}>Productivity</Text>
        </View>
      </View>

      <View style={styles.areaDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="person.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>Supervisor: {item.supervisor}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="house.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>Irrigation: {item.irrigationSystem}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="house.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>Soil: {item.soilType}</Text>
        </View>
      </View>

      <View style={styles.inspectionInfo}>
        <View style={styles.inspectionItem}>
          <Text style={styles.inspectionLabel}>Last Inspection:</Text>
          <Text style={styles.inspectionDate}>{item.lastInspection}</Text>
        </View>
        <View style={styles.inspectionItem}>
          <Text style={styles.inspectionLabel}>Next Due:</Text>
          <Text style={[
            styles.inspectionDate,
            { color: new Date(item.nextInspection) < new Date() ? '#F44336' : '#666666' }
          ]}>
            {item.nextInspection}
          </Text>
        </View>
      </View>

      <View style={styles.areaFooter}>
        <Text style={styles.establishedDate}>Established: {item.establishedDate}</Text>
        <Text style={styles.plantingDensity}>{item.plantingDensity} plants/ha</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Areas</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddArea}
              activeOpacity={0.8}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="house.fill" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search areas by phase, block"
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

      {/* Areas List */}
      <FlatList
        data={filteredAreas}
        renderItem={renderAreaCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="map.fill" size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No areas found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Add areas to start managing your farm blocks'}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
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
  areaCard: {
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
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  areaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  areaTitleSection: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 2,
  },
  areaPhase: {
    fontSize: 12,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  areaMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  metricLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
  },
  areaDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
  },
  inspectionInfo: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inspectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  inspectionLabel: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '500',
  },
  inspectionDate: {
    fontSize: 12,
    color: '#666666',
  },
  areaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  establishedDate: {
    fontSize: 10,
    color: '#999999',
  },
  plantingDensity: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'monospace',
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

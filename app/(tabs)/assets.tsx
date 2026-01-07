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

// Mock data for assets - Locations strictly changed to Block A, B, C, or D
const mockAssets = [
  {
    id: 'asset1',
    name: 'John Deere Tractor 5075E',
    category: 'Heavy Machinery',
    model: '5075E',
    manufacturer: 'John Deere',
    year: 2022,
    serialNumber: 'JD5075E-2022-001',
    status: 'Active',
    location: 'Block A', // Changed from Equipment Yard A
    purchaseDate: '2022-03-15',
    purchasePrice: 45000,
    currentValue: 38000,
    lastMaintenance: '2024-11-15',
    nextMaintenance: '2024-12-15',
    maintenanceCost: 2500,
    workHours: 1250,
    efficiency: 92,
    condition: 'Excellent',
    assignedTo: 'Carlos Rodriguez',
    fuelType: 'Diesel',
    specifications: {
      power: '75 HP',
      weight: '3,200 kg',
      capacity: 'N/A'
    }
  },
  {
    id: 'asset2',
    name: 'Irrigation Controller Pro',
    category: 'Irrigation Equipment',
    model: 'IC-Pro-2024',
    manufacturer: 'AquaTech',
    year: 2024,
    serialNumber: 'AT-ICP-2024-002',
    status: 'Active',
    location: 'Block B', // Changed from Control Room
    purchaseDate: '2024-01-20',
    purchasePrice: 8500,
    currentValue: 7800,
    lastMaintenance: '2024-10-30',
    nextMaintenance: '2024-12-30',
    maintenanceCost: 450,
    workHours: 2400,
    efficiency: 98,
    condition: 'Excellent',
    assignedTo: 'Maria Garcia',
    fuelType: 'Electric',
    specifications: {
      power: '240V AC',
      weight: '15 kg',
      capacity: '24 Zones'
    }
  },
  {
    id: 'asset3',
    name: 'Fertilizer Spreader XL',
    category: 'Application Equipment',
    model: 'FS-XL-500',
    manufacturer: 'FarmSpread',
    year: 2021,
    serialNumber: 'FS-XL-2021-003',
    status: 'Maintenance Required',
    location: 'Block C', // Changed from Storage Shed C
    purchaseDate: '2021-05-10',
    purchasePrice: 12000,
    currentValue: 8500,
    lastMaintenance: '2024-09-20',
    nextMaintenance: '2024-11-30',
    maintenanceCost: 800,
    workHours: 850,
    efficiency: 85,
    condition: 'Good',
    assignedTo: 'Carlos Rodriguez',
    fuelType: 'Manual',
    specifications: {
      power: 'Manual',
      weight: '120 kg',
      capacity: '500 L'
    }
  },
  {
    id: 'asset4',
    name: 'Spray Equipment System',
    category: 'Treatment Equipment',
    model: 'SES-2023',
    manufacturer: 'SprayTech',
    year: 2023,
    serialNumber: 'ST-SES-2023-004',
    status: 'Active',
    location: 'Block A', // Changed from Block A Storage
    purchaseDate: '2023-07-12',
    purchasePrice: 15500,
    currentValue: 13200,
    lastMaintenance: '2024-11-10',
    nextMaintenance: '2025-01-10',
    maintenanceCost: 650,
    workHours: 420,
    efficiency: 94,
    condition: 'Very Good',
    assignedTo: 'Ana Martinez',
    fuelType: 'Electric',
    specifications: {
      power: '12V DC',
      weight: '45 kg',
      capacity: '200 L'
    }
  },
  {
    id: 'asset5',
    name: 'Soil Testing Kit Pro',
    category: 'Testing Equipment',
    model: 'STK-Pro-2024',
    manufacturer: 'SoilLab',
    year: 2024,
    serialNumber: 'SL-STK-2024-005',
    status: 'Out of Service',
    location: 'Block D', // Changed from Laboratory
    purchaseDate: '2024-02-28',
    purchasePrice: 3200,
    currentValue: 2900,
    lastMaintenance: '2024-08-15',
    nextMaintenance: '2024-12-01',
    maintenanceCost: 200,
    workHours: 180,
    efficiency: 0,
    condition: 'Needs Repair',
    assignedTo: 'David Wilson',
    fuelType: 'Battery',
    specifications: {
      power: 'Rechargeable',
      weight: '2.5 kg',
      capacity: 'N/A'
    }
  },
];

export default function AssetsScreen() {
  const router = useRouter();
  const [assets, setAssets] = useState(mockAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');

  const filters = ['All', 'Active', 'Maintenance Required', 'Out of Service'];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || asset.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Maintenance Required': return '#FF9800';
      case 'Out of Service': return '#F44336';
      default: return '#666666';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return '#4CAF50';
      case 'Very Good': return '#8BC34A';
      case 'Good': return '#FFC107';
      case 'Fair': return '#FF9800';
      case 'Needs Repair': return '#F44336';
      default: return '#666666';
    }
  };

  const handleAssetPress = (asset: any) => {
    Alert.alert(
      asset.name,
      `Category: ${asset.category}\nModel: ${asset.model}\nManufacturer: ${asset.manufacturer}\nStatus: ${asset.status}\nLocation: ${asset.location}\n\nCondition: ${asset.condition}\nEfficiency: ${asset.efficiency}%\nWork Hours: ${asset.workHours}h\nAssigned to: ${asset.assignedTo}`,
      [
        { text: 'Schedule Maintenance', onPress: () => Alert.alert('Schedule Maintenance', 'Maintenance scheduling coming soon') },
        { text: 'View Details', onPress: () => Alert.alert('Asset Details', 'Detailed view coming soon') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleAddAsset = () => {
    router.push('/create-form?type=asset');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderAssetCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.assetCard} 
      onPress={() => handleAssetPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.assetHeader}>
        <View style={styles.assetIcon}>
          <IconSymbol name="house.fill" size={24} color="#2E7D32" />
        </View>
        <View style={styles.assetTitleSection}>
          <Text style={styles.assetName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.assetCategory}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.assetDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="house.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>{item.manufacturer} • {item.model}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="house.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="person.fill" size={14} color="#666666" />
          <Text style={styles.detailText}>Assigned to: {item.assignedTo}</Text>
        </View>
      </View>

      <View style={styles.assetMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.efficiency}%</Text>
          <Text style={styles.metricLabel}>Efficiency</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.workHours}h</Text>
          <Text style={styles.metricLabel}>Work Hours</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{formatCurrency(item.currentValue)}</Text>
          <Text style={styles.metricLabel}>Value</Text>
        </View>
      </View>

      <View style={styles.maintenanceInfo}>
        <View style={styles.maintenanceItem}>
          <Text style={styles.maintenanceLabel}>Last Maintenance:</Text>
          <Text style={styles.maintenanceDate}>{item.lastMaintenance}</Text>
        </View>
        <View style={styles.maintenanceItem}>
          <Text style={styles.maintenanceLabel}>Next Due:</Text>
          <Text style={[
            styles.maintenanceDate,
            { color: new Date(item.nextMaintenance) < new Date() ? '#F44336' : '#666666' }
          ]}>
            {item.nextMaintenance}
          </Text>
        </View>
      </View>

      <View style={styles.assetFooter}>
        <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(item.condition) + '20' }]}>
          <Text style={[styles.conditionText, { color: getConditionColor(item.condition) }]}>
            {item.condition}
          </Text>
        </View>
        <Text style={styles.serialNumber}>S/N: {item.serialNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Assets</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddAsset}
              activeOpacity={0.8}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <IconSymbol name="house.fill" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>

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

      <FlatList
        data={filteredAssets}
        renderItem={renderAssetCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="house.fill" size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No assets found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Add assets to start tracking your equipment'}
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
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  aiBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#9C27B0',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  assetCard: {
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
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetTitleSection: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 2,
  },
  assetCategory: {
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
  assetDetails: {
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
  assetMetrics: {
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
  },
  metricValue: {
    fontSize: 16,
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
  maintenanceInfo: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  maintenanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  maintenanceLabel: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
  },
  maintenanceDate: {
    fontSize: 12,
    color: '#666666',
  },
  assetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  serialNumber: {
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
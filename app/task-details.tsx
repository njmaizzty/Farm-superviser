import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams();
  
  // Mock task data - in real app, fetch based on taskId
  const [task] = useState({
    id: taskId || '1',
    title: 'Tree Pruning - Block A',
    description: 'Prune apple trees in the northern section of Block A. Focus on removing dead branches and shaping for optimal fruit production. Use proper safety equipment and follow pruning guidelines.',
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
    location: 'Block A - Northern Section',
    estimatedHours: 16,
    actualHours: 10.5,
    notes: [
      { time: '09:00', note: 'Started pruning in section A1', author: 'John Smith' },
      { time: '11:30', note: 'Completed 40% of planned area', author: 'John Smith' },
      { time: '14:15', note: 'Equipment check - all tools working properly', author: 'John Smith' },
    ],
    checklist: [
      { item: 'Safety equipment check', completed: true },
      { item: 'Tool inspection', completed: true },
      { item: 'Area assessment', completed: true },
      { item: 'Pruning execution', completed: false },
      { item: 'Cleanup and disposal', completed: false },
      { item: 'Final inspection', completed: false },
    ],
  });

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

  const handleEditTask = () => {
    Alert.alert('Edit Task', 'Task editing functionality will be implemented here');
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark Complete',
      'Are you sure you want to mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: () => Alert.alert('Success', 'Task marked as completed!') }
      ]
    );
  };

  const handleAddNote = () => {
    Alert.alert('Add Note', 'Note adding functionality will be implemented here');
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
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditTask}
          activeOpacity={0.7}
        >
          <IconSymbol name="house.fill" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Task Header */}
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleSection}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                <Text style={styles.statusText}>{task.status}</Text>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={styles.priorityText}>{task.priority}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <Text style={styles.progressValue}>{task.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${task.progress}%`,
                    backgroundColor: getStatusColor(task.status)
                  }
                ]} 
              />
            </View>
            <View style={styles.hoursInfo}>
              <Text style={styles.hoursText}>
                {task.actualHours}h / {task.estimatedHours}h
              </Text>
            </View>
          </View>
        </View>

        {/* Task Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsCard}>
            <Text style={styles.description}>{task.description}</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <IconSymbol name="person.fill" size={16} color="#666666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Assigned To</Text>
                  <Text style={styles.detailValue}>{task.assignedTo}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <IconSymbol name="house.fill" size={16} color="#666666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Asset</Text>
                  <Text style={styles.detailValue}>{task.assetName}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <IconSymbol name="house.fill" size={16} color="#666666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{task.location}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <IconSymbol name="house.fill" size={16} color="#666666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{task.category}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <IconSymbol name="house.fill" size={16} color="#666666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>{task.startDate}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <IconSymbol name="house.fill" size={16} color="#666666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>End Date</Text>
                  <Text style={styles.detailValue}>{task.endDate}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist</Text>
          <View style={styles.checklistCard}>
            {task.checklist.map((item, index) => (
              <View key={index} style={styles.checklistItem}>
                <View style={[
                  styles.checkbox,
                  item.completed && styles.checkboxCompleted
                ]}>
                  {item.completed && (
                    <IconSymbol name="house.fill" size={12} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[
                  styles.checklistText,
                  item.completed && styles.checklistTextCompleted
                ]}>
                  {item.item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TouchableOpacity
              style={styles.addNoteButton}
              onPress={handleAddNote}
              activeOpacity={0.7}
            >
              <IconSymbol name="house.fill" size={16} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <View style={styles.notesCard}>
            {task.notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteAuthor}>{note.author}</Text>
                  <Text style={styles.noteTime}>{note.time}</Text>
                </View>
                <Text style={styles.noteText}>{note.note}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleMarkComplete}
          activeOpacity={0.8}
        >
          <IconSymbol name="house.fill" size={20} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      </View>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  taskHeader: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  taskTitleSection: {
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
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
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  hoursInfo: {
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 14,
    color: '#666666',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checklistText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  addNoteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  noteAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  noteTime: {
    fontSize: 12,
    color: '#999999',
  },
  noteText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  actionBar: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 32,
  },
});

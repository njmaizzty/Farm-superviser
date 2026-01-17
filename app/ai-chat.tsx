import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  typing?: boolean;
}

export default function AIChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your AI Farm Assistant. I can help you with task assignments, equipment maintenance, worker scheduling, and operational insights. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "Who should I assign for harvesting?",
    "What are today's priorities?",
    "Show equipment maintenance",
    "What's the weather forecast?",
    "Help me create a task",
    "Show performance report",
  ];

  const aiResponses: Record<string, string> = {
    "worker": "Based on performance data, **Ahmad** has the highest efficiency for harvesting tasks (92% match score). He's currently available with 5 years of experience. For pruning, I recommend **Maya** with an 88% match score.",
    "maintenance": "🔧 **Maintenance Summary:**\n\n• John Deere Tractor - Due in 3 days\n• Fertilizer Spreader - Overdue by 2 days (⚠️ Urgent)\n• Irrigation Controller - Next service in 2 weeks\n\nI recommend scheduling the spreader service immediately to prevent crop delays.",
    "irrigation": "💧 **Irrigation Optimization:**\n\nWeather forecast shows 40% rain chance next week. I suggest:\n\n1. Reduce Block B irrigation by 15%\n2. Adjust schedule to 5-7 AM for optimal absorption\n3. Monitor soil moisture sensors in Block A\n\nEstimated water savings: 2,500 gallons/week",
    "priorities": "📋 **Today's Priorities:**\n\n1. 🔴 Complete pest inspection in Block A (high risk)\n2. 🟠 Assign Ahmad to harvesting - Block C\n3. 🟡 Schedule tractor maintenance\n4. 🟢 Review worker schedules for next week\n\nWould you like me to create tasks for any of these?",
    "task": "I can help you create and assign tasks! Based on current workload:\n\n• **Harvesting**: Ahmad & Faiz are available\n• **Pruning**: Maya is recommended (88% match)\n• **Spraying**: Siti is experienced but currently busy\n\nWhat type of task would you like to create?",
    "weather": "🌤️ **Weather Forecast (Next 7 Days):**\n\n• Today: Sunny, 28°C\n• Tomorrow: Partly cloudy, 27°C\n• Wed-Thu: 40% chance of rain\n• Fri-Sun: Clear skies, 29-31°C\n\nRecommendation: Plan outdoor tasks for Friday onwards.",
    "performance": "📊 **Farm Performance Summary:**\n\n• Task completion rate: 87% (+5% from last month)\n• Worker productivity: 92% average\n• Equipment uptime: 94%\n• Pending tasks: 12\n\nTop performer this week: Ahmad (15 tasks completed)",
    "help": "I can help you with:\n\n🧑‍🌾 **Workers** - Find best matches, check availability\n📋 **Tasks** - Create, assign, and track tasks\n🚜 **Equipment** - Maintenance schedules, status\n🌱 **Areas** - Block management, crop status\n📊 **Reports** - Performance analytics\n🌤️ **Weather** - Forecasts and recommendations\n\nJust ask me anything!",
    "default": "I'm your AI Farm Assistant! I can help with:\n\n• Worker assignments & recommendations\n• Task creation & scheduling\n• Equipment maintenance alerts\n• Weather-based planning\n• Performance insights\n\nTry asking: \"Who should I assign for harvesting?\" or \"What are today's priorities?\""
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('worker') || message.includes('assign') || message.includes('who') || message.includes('best')) {
      return aiResponses.worker;
    } else if (message.includes('maintenance') || message.includes('service') || message.includes('repair') || message.includes('equipment')) {
      return aiResponses.maintenance;
    } else if (message.includes('irrigation') || message.includes('water') || message.includes('optimize')) {
      return aiResponses.irrigation;
    } else if (message.includes('priority') || message.includes('today') || message.includes('urgent') || message.includes('important')) {
      return aiResponses.priorities;
    } else if (message.includes('task') || message.includes('create') || message.includes('schedule')) {
      return aiResponses.task;
    } else if (message.includes('weather') || message.includes('rain') || message.includes('forecast')) {
      return aiResponses.weather;
    } else if (message.includes('performance') || message.includes('report') || message.includes('analytics') || message.includes('stats')) {
      return aiResponses.performance;
    } else if (message.includes('help') || message.includes('what can you') || message.includes('how')) {
      return aiResponses.help;
    } else {
      return aiResponses.default;
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: ChatMessage) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage
      ]}
    >
      {!message.isUser && (
        <View style={styles.aiAvatar}>
          <IconSymbol name="brain.head.profile" size={16} color="#9C27B0" />
        </View>
      )}
      
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.aiText
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            message.isUser ? styles.userTime : styles.aiTime
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessage]}>
      <View style={styles.aiAvatar}>
        <IconSymbol name="house.fill" size={16} color="#9C27B0" />
      </View>
      <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
        <View style={styles.typingIndicator}>
          <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
          <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
          <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
        </View>
        <Text style={styles.typingText}>AI is thinking...</Text>
      </View>
    </View>
  );

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
          <IconSymbol name="chevron.left" size={24} color="#9C27B0" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Farm Assistant</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <IconSymbol name="sparkles" size={20} color="#9C27B0" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isTyping && renderTypingIndicator()}
        </ScrollView>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
            <View style={styles.quickQuestionsGrid}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me anything about your farm.."
              placeholderTextColor="#999999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled
              ]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              activeOpacity={0.8}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#9C27B0',
    marginLeft: 'auto',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  typingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#333333',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTime: {
    color: '#999999',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9C27B0',
    marginRight: 4,
  },
  typingText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#9C27B0',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#9C27B0',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>
                {user?.name || "Supervisor"}
              </Text>
              <Text style={styles.userRole}>Farm Supervisor</Text>
            </View>

            <View style={styles.headerActions}>

              <TouchableOpacity 
              style={styles.avatarButton} 
              onPress={() => router.push("/")}
            >
                <IconSymbol name="house.fill" size={40} color="#FFFFFF" />
                  </TouchableOpacity>

            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Weather Widget */}
        <View style={styles.weatherContainer}>
          <View style={styles.weatherCard}>
            <View style={styles.weatherContent}>
              <View style={styles.weatherLeft}>
                <IconSymbol name="house.fill" size={32} color="#FFFFFF" />
                <View style={styles.weatherInfo}>
                  <Text style={styles.weatherTemp}>28°C</Text>
                  <Text style={styles.weatherDesc}>Sunny</Text>
                </View>
              </View>

              <View style={styles.weatherRight}>
                <Text style={styles.weatherLocation}>Farm Location</Text>
                <Text style={styles.weatherHumidity}>
                  Humidity: 65%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Todays Overview</Text>

          <View style={styles.statsGrid}>
            <StatCard title="Active Tasks" value="12" trend="+2" />
            <StatCard title="Workers" value="8" trend="online" />
            <StatCard title="Maintenance" value="3" trend="due" />
            <StatCard title="Areas" value="5" trend="active" />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/tasks")}
            >
            <ActionCard
              title="Create Task"
              subtitle="Assign new work"
              icon="plus.circle.fill"
              color="#FFD600" // Yellow
            />
          </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/areas")}>
              <ActionCard
                title="View Areas"
                subtitle="Manage Area"
                icon="map.fill"
                color="#F44336" // Red
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/workers")}>
            <ActionCard
              title="Manage Workers"
              subtitle="Check Progress"
              icon="person.3.fill"
              color="#2196F3" // Blue
            />
          </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/assets")}>
            <ActionCard
              title="Asset Status"
              subtitle="Equipment check"
              icon="wrench.fill"
              color="#9C27B0" // Purple
            />
          </TouchableOpacity>
          </View>
        </View>

        {/* Announcements (REPLACED AI SECTION) */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>📢 Announcements</Text>

          <View style={styles.activityCard}>
            <ActivityItem
              title="System Maintenance"
              subtitle="System maintenance tonight at 11 PM"
              time="Today"
            />
            <ActivityItem
              title="Safety Reminder"
              subtitle="All workers must wear PPE"
              time="Last Week"
            />
            <ActivityItem
              title="Meeting Notice"
              subtitle="Supervisor meeting tomorrow 9 AM"
              time="Yesterday"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>🕐 Recent Activity</Text>

          <View style={styles.activityCard}>
            <ActivityItem
              title="Task Completed"
              subtitle="Tree pruning in Block A-1"
              time="2 hours ago"
            />
            <ActivityItem
              title="Worker Assigned"
              subtitle="Assigned to irrigation maintenance"
              time="4 hours ago"
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statTrend}>{trend}</Text>
    </View>
  );
}

function ActionCard({
  title,
  subtitle,
  icon = "house.fill",
  color = "#2196F3", // default color
}: {
  title: string;
  subtitle: string;
  icon?: string;
  color?: string;
}) {
  return (
    <View style={[styles.actionCard, { backgroundColor: color }]}>
      <IconSymbol name={icon} size={28} color="#FFFFFF" />
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function ActivityItem({
  title,
  subtitle,
  time,
}: {
  title: string;
  subtitle: string;
  time: string;
}) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFE",
  },

  headerGradient: {
    backgroundColor: "#2E7D32",
    paddingTop: 20,
    paddingBottom: 30,
  },

  header: {
    paddingHorizontal: 24,
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfo: {
    flex: 1,
  },

  greeting: {
    fontSize: 16,
    color: "#E8F5E8",
  },

  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  userRole: {
    fontSize: 14,
    color: "#C8E6C9",
  },

  headerActions: {
    flexDirection: "row",
    gap: 12,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FF5722",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
  },

  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollView: {
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F8FAFE",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A237E",
    marginBottom: 16,
  },

  weatherContainer: {
    padding: 24,
  },

  weatherCard: {
    backgroundColor: "#1976D2",
    borderRadius: 16,
    padding: 20,
  },

  weatherContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  weatherLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  weatherInfo: {
    marginLeft: 16,
  },

  weatherTemp: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  weatherDesc: {
    color: "#E3F2FD",
  },

  weatherRight: {
    alignItems: "flex-end",
  },

  weatherLocation: {
    color: "#E3F2FD",
  },

  weatherHumidity: {
    color: "#BBDEFB",
  },

  statsContainer: {
    paddingHorizontal: 24,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  statValue: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  statTitle: {
    color: "#FFFFFF",
  },

  statTrend: {
    color: "#E8F5E8",
    fontSize: 12,
  },

  actionsContainer: {
    paddingHorizontal: 24,
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: "#2196F3",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },

  actionTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 8,
  },

  actionSubtitle: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  activityContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },

  activityItem: {
    marginBottom: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontWeight: "600",
    color: "#1A237E",
  },

  activitySubtitle: {
    color: "#666666",
  },

  activityTime: {
    fontSize: 12,
    color: "#999999",
  },

  bottomSpacing: {
    height: 32,
  },
});

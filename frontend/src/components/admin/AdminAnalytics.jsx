import React, { useState } from "react";
import { 
  Users, UserCheck, Clock, TrendingUp, 
  CheckCircle, XCircle, AlertCircle,
  BarChart3, PieChart, ArrowUp, ArrowDown,
  ThumbsUp, Award, FileCheck, Sparkles,
  Zap, Target, Flame, Crown, Calendar,
  Eye, UserPlus, Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("week");

  const stats = [
    { 
      icon: Users, 
      label: "Total Users", 
      value: "1,284", 
      change: "+12.5%", 
      up: true,
      description: "Active platform users"
    },
    { 
      icon: UserCheck, 
      label: "Total Drivers", 
      value: "892", 
      change: "+8.2%", 
      up: true,
      description: "Registered drivers"
    },
    { 
      icon: Clock, 
      label: "Pending Profiles", 
      value: "45", 
      change: "-3.1%", 
      up: false,
      description: "Awaiting moderation"
    },
    { 
      icon: TrendingUp, 
      label: "Moderation Turnaround", 
      value: "2.3 days", 
      change: "-0.5%", 
      up: true,
      description: "Average days"
    }
  ];

  // Signup Trends
  const signupData = [
    { day: "Mon", value: 12 },
    { day: "Tue", value: 18 },
    { day: "Wed", value: 15 },
    { day: "Thu", value: 22 },
    { day: "Fri", value: 8 },
    { day: "Sat", value: 5 },
    { day: "Sun", value: 3 }
  ];

  const maxValue = Math.max(...signupData.map(d => d.value));

  // Status Distribution
  const statusData = [
    { label: "Approved", value: 789, percentage: 88 },
    { label: "Pending", value: 45, percentage: 5 },
    { label: "Rejected", value: 58, percentage: 7 }
  ];

  // Recent Activity
  const recentActivity = [
    { 
      id: 1, 
      type: "signup", 
      message: "New driver registered: Ali Hassan",
      time: "2 minutes ago",
      icon: UserPlus,
      color: "text-[#2d6a4f]"
    },
    { 
      id: 2, 
      type: "approval", 
      message: "Driver profile approved: Usman Khan",
      time: "15 minutes ago",
      icon: CheckCircle,
      color: "text-[#2d6a4f]"
    },
    { 
      id: 3, 
      type: "rejection", 
      message: "Driver profile rejected: Ayesha Malik",
      time: "45 minutes ago",
      icon: XCircle,
      color: "text-red-500"
    },
    { 
      id: 4, 
      type: "recruiter", 
      message: "New recruiter registered: Fast Logistics",
      time: "1 hour ago",
      icon: Briefcase,
      color: "text-blue-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2a3a] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2d6a4f]" />
            Analytics Dashboard
          </h1>
          <p className="text-sm text-[#8aa89a]">Platform overview and performance metrics</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2d6a4f] text-white rounded-xl text-sm font-medium hover:bg-[#1a4a35] transition-all shadow-md hover:shadow-lg">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-[#e8f5ee] shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-[#2d6a4f]" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  stat.up ? 'text-[#2d6a4f]' : 'text-red-500'
                }`}>
                  {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1a2a3a] mt-3">{stat.value}</h3>
              <p className="text-sm text-[#4a6a5a]">{stat.label}</p>
              <p className="text-xs text-[#8aa89a] mt-1">{stat.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signup Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-[#e8f5ee] shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1a2a3a]">Signup Trends</h3>
              <p className="text-xs text-[#8aa89a]">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#2d6a4f] font-medium">+23%</span>
              <TrendingUp className="w-4 h-4 text-[#2d6a4f]" />
            </div>
          </div>
          <div className="h-52 flex items-end justify-between gap-2">
            {signupData.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className={`w-full max-w-[44px] rounded-lg transition-all ${
                      item.value === maxValue 
                        ? 'bg-gradient-to-t from-[#2d6a4f] to-[#409f7a] shadow-lg shadow-[#2d6a4f]/20' 
                        : 'bg-[#d4ede3] hover:bg-[#b8d5c8]'
                    }`}
                    style={{ height: `${height}%`, minHeight: height > 0 ? '8px' : '0' }}
                  />
                  <span className="text-xs text-[#8aa89a] font-medium">{item.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 border border-[#e8f5ee] shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1a2a3a]">Profile Status</h3>
              <p className="text-xs text-[#8aa89a]">Distribution overview</p>
            </div>
            <PieChart className="w-4 h-4 text-[#8aa89a]" />
          </div>
          <div className="space-y-4">
            {statusData.map((item, index) => {
              const colors = {
                'Approved': 'bg-[#2d6a4f]',
                'Pending': 'bg-yellow-500',
                'Rejected': 'bg-red-500'
              };
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#4a6a5a]">{item.label}</span>
                    <span className="font-semibold text-[#1a2a3a]">{item.value}</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#e8f5ee] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                      className={`h-full rounded-full ${colors[item.label]}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-[#e8f5ee] shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-[#1a2a3a]">Recent Activity</h3>
            <p className="text-xs text-[#8aa89a]">Latest platform updates</p>
          </div>
          <button className="text-xs text-[#2d6a4f] font-medium hover:underline">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-3 bg-[#f8fbf9] rounded-xl hover:bg-[#e8f5ee] transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-[#e8f5ee] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#1a2a3a]">{activity.message}</p>
                  <p className="text-xs text-[#8aa89a]">{activity.time}</p>
                </div>
                <button className="text-xs text-[#2d6a4f] opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                  View
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Import RefreshCw
import { RefreshCw } from "lucide-react";

export default AdminAnalytics;
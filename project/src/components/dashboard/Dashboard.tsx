import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../../lib/api';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Mic, TrendingUp, Target, AlertCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: userAPI.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Average Fluency',
      value: `${Math.round(dashboardData?.average_fluency || 0)}%`,
      icon: Mic,
      color: 'blue' as const,
      progress: dashboardData?.average_fluency || 0,
    },
    {
      title: 'Grammar Score',
      value: `${Math.round(dashboardData?.average_grammar || 0)}%`,
      icon: Target,
      color: 'green' as const,
      progress: dashboardData?.average_grammar || 0,
    },
    {
      title: 'Practice Sessions',
      value: dashboardData?.session_count || 0,
      icon: TrendingUp,
      color: 'purple' as const,
      progress: Math.min((dashboardData?.session_count || 0) * 10, 100),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your speech improvement progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} gradient>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">{stat.title}</p>
                  <ProgressBar value={stat.progress} color={stat.color} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {dashboardData?.recent_errors && dashboardData.recent_errors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Issues</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recent_errors.map((error, index) => (
                <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Grammar Issue</p>
                      <p className="text-sm text-orange-600 mt-1">
                        Original: "{error.original}"
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        Suggested: "{error.corrected}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Quick Start</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Start Practicing</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Record yourself speaking to get instant feedback on fluency and grammar.
                </p>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Go to Practice →
                </button>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Review History</h3>
                <p className="text-sm text-green-700 mb-3">
                  Analyze your past sessions to track improvement over time.
                </p>
                <button className="text-sm font-medium text-green-600 hover:text-green-500">
                  View History →
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Tips for Improvement</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Practice speaking slowly and clearly to improve fluency scores
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Focus on complete sentences to boost grammar scores
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  Regular practice leads to consistent improvement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
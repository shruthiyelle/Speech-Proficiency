import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { userAPI } from '../../lib/api';
import { Card, CardHeader, CardContent } from '../ui/Card';

export const AnalyticsView: React.FC = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: userAPI.getHistory,
  });

  const { data: dashboardData } = useQuery({
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

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Complete some practice sessions to see your analytics.</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = sessions
    .slice(-10) // Last 10 sessions
    .map((session, index) => {
      const averageFluency = session.fluency_scores.reduce((sum, score) => sum + score.score, 0) / session.fluency_scores.length;
      return {
        session: `#${session.id}`,
        fluency: Math.round(averageFluency),
        grammar: Math.round(session.grammar_score),
        date: new Date(session.created_at).toLocaleDateString(),
      };
    });

  // Calculate improvement trends
  const latestSessions = sessions.slice(-5);
  const earlierSessions = sessions.slice(-10, -5);
  
  const latestAvgFluency = latestSessions.reduce((sum, session) => {
    const avg = session.fluency_scores.reduce((s, score) => s + score.score, 0) / session.fluency_scores.length;
    return sum + avg;
  }, 0) / latestSessions.length;

  const earlierAvgFluency = earlierSessions.length > 0 ? earlierSessions.reduce((sum, session) => {
    const avg = session.fluency_scores.reduce((s, score) => s + score.score, 0) / session.fluency_scores.length;
    return sum + avg;
  }, 0) / earlierSessions.length : latestAvgFluency;

  const fluencyTrend = latestAvgFluency - earlierAvgFluency;

  const stats = [
    {
      title: 'Fluency Trend',
      value: `${fluencyTrend > 0 ? '+' : ''}${Math.round(fluencyTrend)}%`,
      icon: TrendingUp,
      color: fluencyTrend >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: fluencyTrend >= 0 ? 'bg-green-100' : 'bg-red-100',
    },
    {
      title: 'Best Grammar Score',
      value: `${Math.round(Math.max(...sessions.map(s => s.grammar_score)))}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Practice Streak',
      value: `${Math.min(sessions.length, 7)} days`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Sessions',
      value: sessions.length,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your progress and identify areas for improvement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Progress Over Time</h2>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="fluency" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Fluency %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="grammar" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Grammar %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Session Scores</h2>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="fluency" fill="#3B82F6" name="Fluency %" />
                  <Bar dataKey="grammar" fill="#10B981" name="Grammar %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Performance Insights</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Strengths</h3>
              <div className="space-y-2">
                {dashboardData?.average_fluency && dashboardData.average_fluency >= 70 && (
                  <div className="flex items-center space-x-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Good fluency consistency</span>
                  </div>
                )}
                {dashboardData?.average_grammar && dashboardData.average_grammar >= 80 && (
                  <div className="flex items-center space-x-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Strong grammar skills</span>
                  </div>
                )}
                {sessions.length >= 5 && (
                  <div className="flex items-center space-x-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Consistent practice habit</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Areas for Improvement</h3>
              <div className="space-y-2">
                {dashboardData?.average_fluency && dashboardData.average_fluency < 70 && (
                  <div className="flex items-center space-x-2 text-orange-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Focus on speaking fluency</span>
                  </div>
                )}
                {dashboardData?.average_grammar && dashboardData.average_grammar < 80 && (
                  <div className="flex items-center space-x-2 text-orange-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Practice grammar structures</span>
                  </div>
                )}
                {fluencyTrend < 0 && (
                  <div className="flex items-center space-x-2 text-orange-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Recent decline in fluency</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
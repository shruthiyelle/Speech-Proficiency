import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Mic, Target } from 'lucide-react';
import { userAPI } from '../../lib/api';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export const HistoryView: React.FC = () => {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: userAPI.getHistory,
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
        <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Practice Sessions Yet</h3>
        <p className="text-gray-600">Start practicing to see your session history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session History</h1>
        <p className="text-gray-600">Review your past practice sessions and track progress</p>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const averageFluency = session.fluency_scores.reduce((sum, score) => sum + score.score, 0) / session.fluency_scores.length;
          const date = new Date(session.created_at);
          
          return (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mic className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Practice Session #{session.id}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{date.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{Math.round(averageFluency)}%</div>
                      <div className="text-xs text-gray-600">Fluency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{Math.round(session.grammar_score)}%</div>
                      <div className="text-xs text-gray-600">Grammar</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Transcription</h4>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {session.transcription}
                    </p>
                  </div>

                  {session.corrected_text !== session.transcription && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Version</h4>
                      <p className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">
                        {session.corrected_text}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Fluency Progress</h4>
                      <ProgressBar 
                        value={averageFluency} 
                        color={averageFluency >= 80 ? 'green' : averageFluency >= 60 ? 'yellow' : 'red'} 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Grammar Score</h4>
                      <ProgressBar 
                        value={session.grammar_score} 
                        color={session.grammar_score >= 80 ? 'green' : session.grammar_score >= 60 ? 'yellow' : 'red'} 
                      />
                    </div>
                  </div>

                  {session.errors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Issues Found ({session.errors.length})
                      </h4>
                      <div className="space-y-2">
                        {session.errors.slice(0, 3).map((error, index) => (
                          <div key={index} className="text-xs bg-orange-50 p-2 rounded border border-orange-200">
                            <span className="text-orange-800">"{error.original}"</span>
                            <span className="text-gray-600"> → </span>
                            <span className="text-green-800">"{error.corrected}"</span>
                          </div>
                        ))}
                        {session.errors.length > 3 && (
                          <div className="text-xs text-gray-600">
                            +{session.errors.length - 3} more issues
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
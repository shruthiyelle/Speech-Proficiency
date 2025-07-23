import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Mic, Square, Play, Pause, RotateCcw, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { speechAPI } from '../../lib/api';
import { SpeechResults } from './SpeechResults';
import type { SpeechOutput } from '../../types';

export const RecordingInterface: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<SpeechOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const queryClient = useQueryClient();
  
  const {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const analyzeAudioMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const sessionResponse = await speechAPI.startRecording();
      return speechAPI.stopRecording(sessionResponse.session_id, audioBlob);
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onSettled: () => {
      setIsAnalyzing(false);
    },
  });

  const handleAnalyze = () => {
    if (audioBlob) {
      setIsAnalyzing(true);
      analyzeAudioMutation.mutate(audioBlob);
    }
  };

  const handleReset = () => {
    resetRecording();
    setAnalysisResults(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Speech Practice</h1>
        <p className="text-gray-600">Record yourself speaking to get instant feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recording Studio</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="relative">
                <div
                  className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                  }`}
                >
                  <Mic className="w-12 h-12 text-white" />
                </div>
                {isRecording && (
                  <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-red-300 animate-ping"></div>
                )}
              </div>

              <div className="space-y-4">
                {!isRecording && !audioUrl && (
                  <Button onClick={startRecording} size="lg" className="w-full">
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <Button onClick={stopRecording} variant="secondary" size="lg" className="w-full">
                    <Square className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                )}

                {audioUrl && !isRecording && (
                  <div className="space-y-3">
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/webm" />
                    </audio>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAnalyze}
                        isLoading={isAnalyzing}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Analyze Speech
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="flex-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {isRecording && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Recording in progress...</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 animate-pulse"></div>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Analyzing your speech...</p>
                  <ProgressBar value={75} color="blue" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Tips for Better Results</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Before Recording</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Find a quiet environment</li>
                  <li>• Speak clearly and at normal pace</li>
                  <li>• Stay 6-12 inches from microphone</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Speaking Tips</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Use complete sentences</li>
                  <li>• Pause naturally between ideas</li>
                  <li>• Vary your tone and pace</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">What We Analyze</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Fluency and flow</li>
                  <li>• Grammar accuracy</li>
                  <li>• Speech clarity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {analysisResults && (
        <SpeechResults results={analysisResults} />
      )}
    </div>
  );
};
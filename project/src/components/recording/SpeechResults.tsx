import React, { useState } from 'react';
import { Play, Pause, Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { speechAPI } from '../../lib/api';
import type { SpeechOutput, FluencySegment } from '../../types';

interface SpeechResultsProps {
  results: SpeechOutput;
}

export const SpeechResults: React.FC<SpeechResultsProps> = ({ results }) => {
  const [isPlayingCorrected, setIsPlayingCorrected] = useState(false);

  const handlePlayCorrected = () => {
    const audio = new Audio(speechAPI.getAudioUrl(results.corrected_audio_url.split('/').pop() || ''));
    
    audio.onplay = () => setIsPlayingCorrected(true);
    audio.onended = () => setIsPlayingCorrected(false);
    audio.onpause = () => setIsPlayingCorrected(false);
    
    if (isPlayingCorrected) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const averageFluency = results.fluency_scores.reduce((sum, score) => sum + score.score, 0) / results.fluency_scores.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Overall Scores</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Fluency</span>
                  <span className="text-sm font-bold text-gray-900">{Math.round(averageFluency)}%</span>
                </div>
                <ProgressBar 
                  value={averageFluency} 
                  color={averageFluency >= 80 ? 'green' : averageFluency >= 60 ? 'yellow' : 'red'} 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Grammar</span>
                  <span className="text-sm font-bold text-gray-900">{Math.round(results.grammar_score)}%</span>
                </div>
                <ProgressBar 
                  value={results.grammar_score} 
                  color={results.grammar_score >= 80 ? 'green' : results.grammar_score >= 60 ? 'yellow' : 'red'} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Corrected Audio</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Listen to the corrected version of your speech with improved grammar and pronunciation.
              </p>
              <Button
                onClick={handlePlayCorrected}
                variant="outline"
                className="w-full"
              >
                {isPlayingCorrected ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Corrected Audio
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play Corrected Audio
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Transcription & Corrections</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Original Transcription</h4>
              <p className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {results.transcription}
              </p>
            </div>
            
            {results.corrected_text !== results.transcription && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Corrected Text</h4>
                <p className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
                  {results.corrected_text}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Fluency Timeline</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your speech broken down by time segments with fluency scores.
            </p>
            <div className="space-y-2">
              {results.fluency_scores.map((segment, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500 w-20">
                    {Math.round(segment.start_time)}s - {Math.round(segment.end_time)}s
                  </span>
                  <div className="flex-1">
                    <ProgressBar 
                      value={segment.score} 
                      color={segment.color === 'green' ? 'green' : segment.color === 'yellow' ? 'yellow' : 'red'} 
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-12">
                    {Math.round(segment.score)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {results.errors.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Grammar Issues Found</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.errors.map((error, index) => (
                <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-800 mb-1">Grammar Correction</p>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Original:</span> "{error.original}"
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Corrected:</span> "{error.corrected}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface FluencySegment {
  start_time: number;
  end_time: number;
  score: number;
  color: string;
}

export interface SpeechError {
  type: string;
  original: string;
  corrected: string;
}

export interface Session {
  id: number;
  audio_path: string;
  transcription: string;
  corrected_text: string;
  fluency_scores: FluencySegment[];
  grammar_score: number;
  errors: SpeechError[];
  created_at: string;
}

export interface DashboardData {
  average_fluency: number;
  average_grammar: number;
  session_count: number;
  recent_errors: SpeechError[];
}

export interface SpeechOutput {
  transcription: string;
  corrected_text: string;
  fluency_scores: FluencySegment[];
  grammar_score: number;
  errors: SpeechError[];
  corrected_audio_url: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}
export type LayerType = 'general' | 'business' | 'audio_rules';
export type AnswerOptionType = 'Yes/No/NA' | 'Yes/No';

export interface AudioRuleCriterionData {
  max_hold_time_s?: number;
  consultant_speaking_time_ratio_min_percent?: number;
  consultant_speaking_time_ratio_max_percent?: number;
  max_interruptions?: number;
  max_silence_duration_s?: number;
  overlapping_threshold_percent?: number;
  
  is_hold_time_enabled?: boolean;
  is_speaker_ratio_enabled?: boolean;
  is_interruptions_enabled?: boolean;
  is_silence_enabled?: boolean;
}

export interface Criterion {
  code: string;
  name: string;
  layer: LayerType;
  options_type?: AnswerOptionType;
  yes_score?: number;
  no_score?: number;
  na_score?: number;
  max_score?: number;
  audio_rules_data?: AudioRuleCriterionData;
}

export interface Scorecard {
  id: string;
  name: string;
  description?: string;
  status: string;
  threshold?: number;
  is_global_fallback: boolean;
  criteria: Criterion[];
}

export type ScorecardCreate = Omit<Scorecard, 'id'>;

export interface TopicMapping {
  topic_id: string;
  topic_name: string;
  scorecard_id: string;
}

export interface GenerateScorecardRequest {
  goal?: string;
  raw_text: string;
}

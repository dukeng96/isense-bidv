import { apiClient } from '@/api/apiClient';
import { Scorecard, TopicMapping } from '@/types';

export const scorecardApi = {
  getScorecards: async (): Promise<Scorecard[]> => {
    const { data } = await apiClient.get('/scorecards');
    return data;
  },
  
  getScorecard: async (id: string): Promise<Scorecard> => {
    const { data } = await apiClient.get(`/scorecards/${id}`);
    return data;
  },

  createScorecard: async (payload: Omit<Scorecard, 'id'>): Promise<Scorecard> => {
    const { data } = await apiClient.post('/scorecards', payload);
    return data;
  },

  updateScorecard: async (id: string, payload: Omit<Scorecard, 'id'>): Promise<Scorecard> => {
    const { data } = await apiClient.put(`/scorecards/${id}`, payload);
    return data;
  },

  deleteScorecard: async (id: string): Promise<void> => {
    await apiClient.delete(`/scorecards/${id}`);
  },

  getMappings: async (): Promise<TopicMapping[]> => {
    const { data } = await apiClient.get('/mappings');
    return data;
  },

  createMapping: async (payload: TopicMapping): Promise<TopicMapping> => {
    const { data } = await apiClient.post('/mappings', payload);
    return data;
  },

  deleteMapping: async (topicId: string): Promise<void> => {
    await apiClient.delete(`/mappings/${topicId}`);
  },

  setGlobalFallback: async (scorecardId: string): Promise<void> => {
    await apiClient.put('/mappings/global-fallback', { scorecard_id: scorecardId });
  }
};

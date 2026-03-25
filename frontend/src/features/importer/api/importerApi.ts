import { apiClient } from '@/api/apiClient';
import { Criterion, GenerateScorecardRequest } from '@/types';

export const importerApi = {
  generateScorecard: async (payload: GenerateScorecardRequest): Promise<Criterion[]> => {
    const { data } = await apiClient.post('/ai/generate-scorecard', payload);
    return data;
  }
};

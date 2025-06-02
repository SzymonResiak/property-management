import { v4 as uuidv4 } from 'uuid';
import {
  MaintenanceRequestInput,
  MaintenanceRequest,
  Priority,
} from '@/models/types';
import { analyzeMessage as analyzeMessageService } from '@/services/analysisService';
import * as requestRepository from '@/repositories/requestRepository';

export const saveRequest = async (
  input: MaintenanceRequestInput
): Promise<MaintenanceRequest> => {
  const id = uuidv4();

  const analysis = analyzeMessageService(input.message);

  const request: Omit<MaintenanceRequest, 'createdAt'> = {
    id,
    tenantId: input.tenantId,
    message: input.message,
    priority: analysis.priority,
    analyzedFactors: analysis,
    resolved: false,
  };

  return await requestRepository.createRequest(request);
};

export const getRequests = async (
  priority?: Priority
): Promise<MaintenanceRequest[]> => {
  if (priority) {
    return await requestRepository.getRequestsByPriority(priority);
  }

  return await requestRepository.getAllRequests();
};

import { v4 as uuidv4 } from 'uuid';
import {
  MaintenanceRequestInput,
  MaintenanceRequest,
  Priority,
  GetRequestListOutputDTO,
  CreateRequestOutputDTO,
  AnalyzedFactors,
} from '@/models/types';
import { analyzeMessage as analyzeMessageService } from '@/services/analysisService';
import * as requestRepository from '@/repositories/requestRepository';

export const saveRequest = async (
  input: MaintenanceRequestInput
): Promise<CreateRequestOutputDTO> => {
  const id = uuidv4();

  const analysis: AnalyzedFactors = analyzeMessageService(input.message);

  const requestToSave: Omit<MaintenanceRequest, 'createdAt'> = {
    id,
    tenantId: input.tenantId,
    message: input.message,
    priority: analysis.priority,
    analyzedFactors: analysis,
    resolved: false,
  };

  const savedRequest = await requestRepository.createRequest(requestToSave);

  return {
    requestId: savedRequest.id,
    priority: savedRequest.priority,
    analyzedFactors: savedRequest.analyzedFactors,
  };
};

const mapRequestToOutputDTO = (
  request: MaintenanceRequest
): GetRequestListOutputDTO => {
  return {
    id: request.id,
    priority: request.priority,
    message: request.message,
    createdAt: request.createdAt,
    resolved: request.resolved,
  };
};

export const getRequests = async (
  priority?: Priority
): Promise<GetRequestListOutputDTO[]> => {
  let requests: MaintenanceRequest[];

  if (priority) {
    requests = await requestRepository.getRequestsByPriority(priority);
  } else {
    requests = await requestRepository.getAllRequests();
  }

  return requests.map(mapRequestToOutputDTO);
};

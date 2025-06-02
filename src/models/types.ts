export type Priority = 'high' | 'medium' | 'low';

export interface MaintenanceRequestInput {
  tenantId: string;
  message: string;
}

export interface AnalyzedFactors {
  keywords: string[];
  urgencyIndicators: number;
  priorityScore: number;
  priority: Priority;
}

export interface KeywordData {
  priority: Priority;
  weight: number;
}

export interface MaintenanceRequest extends MaintenanceRequestInput {
  id: string;
  createdAt: string; // server generated timestamp
  priority: Priority;
  analyzedFactors: AnalyzedFactors;
  resolved: boolean;
}

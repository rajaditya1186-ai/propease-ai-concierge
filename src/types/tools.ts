import { ProjectId } from './booking';

export interface ToolCheckAvailableSlotsArgs {
  projectId: ProjectId;
  date?: string;
}

export interface ToolHoldSlotArgs {
  slotId: string;
  leadPhone: string;
}

export interface ToolConfirmBookingArgs {
  slotId: string;
  leadName: string;
  leadPhone: string;
  projectId: ProjectId;
  configuration: '2 BHK' | '3 BHK';
}

export interface ToolEscalateToExecutiveArgs {
  leadId: string;
  reason: string;
  summary: string;
}

export type AgentToolName =
  | 'check_available_slots'
  | 'hold_slot'
  | 'confirm_site_visit'
  | 'escalate_to_executive';

export interface AgentToolCallResult {
  toolName: AgentToolName;
  success: boolean;
  data?: unknown;
  error?: string;
  userFacingMessage: string;
}

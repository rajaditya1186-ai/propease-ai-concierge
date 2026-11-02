import { LanguageCode } from './lead';
import { ProjectId } from './booking';

export type MessageSender = 'user' | 'assistant' | 'system' | 'executive';

export type UserIntent =
  | 'GREETING'
  | 'ASK_PROJECT_SPECS'
  | 'ASK_PRICE'
  | 'ASK_LOCATION'
  | 'ASK_AMENITIES'
  | 'ASK_POSSESSION'
  | 'ASK_RERA'
  | 'ASK_DISCOUNT' // Triggers anti-negotiation boundary
  | 'REQUEST_VISIT' // Triggers booking tool
  | 'REQUEST_HUMAN' // Triggers executive escalation
  | 'UNKNOWN_OFF_FACTSHEET'; // Triggers missing-fact deferral & chat flagging

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  language: LanguageCode;
  detectedIntent?: UserIntent;
  toolCallTriggered?: string;
  isFlaggedForAudit?: boolean;
  flagReason?: string;
}

export interface BuyerConversation {
  conversationId: string;
  leadId: string;
  leadName?: string;
  leadPhone?: string;
  currentProjectId: ProjectId;
  language: LanguageCode;
  extractedRequirements: {
    bhk?: '2 BHK' | '3 BHK';
    budgetMin?: number;
    budgetMax?: number;
    preferredTime?: string;
    hasRequestedHuman?: boolean;
    isSeriousBuyer?: boolean;
  };
  messages: ChatMessage[];
  status: 'Active' | 'Booked' | 'EscalatedToHuman' | 'Closed';
  assignedExecutiveId?: string;
  flaggedForSalesHead: boolean;
  flagNotes?: string;
  createdAt: string;
  updatedAt: string;
}

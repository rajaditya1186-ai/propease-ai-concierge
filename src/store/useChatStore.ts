import { useState } from 'react';
import { ChatMessage, BuyerConversation } from '../types/chat';
import { LanguageCode } from '../types/lead';
import { ProjectId } from '../types/booking';
import { generateGroundedResponse } from '../services/aiEngine';
import { MASTER_FACT_SHEET } from '../data/factSheetData';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'MSG-001',
    sender: 'assistant',
    text: 'Welcome to Company A Concierge! I can provide official verified facts on The Grand Orchid (S.G. Highway) and Orchid Heights (Shela), or help you schedule a private site visit. How may I assist you?',
    timestamp: new Date().toISOString(),
    language: 'en',
    detectedIntent: 'GREETING',
  },
];

export function useChatStore() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentProject, setCurrentProject] = useState<ProjectId>('Project 1');
  const [isTyping, setIsTyping] = useState(false);
  const [flaggedConversations, setFlaggedConversations] = useState<BuyerConversation[]>([
    {
      conversationId: 'CONV-901',
      leadId: 'LD-58211',
      leadName: 'Nidhi Shah',
      leadPhone: '+919825058211',
      currentProjectId: 'Project 2',
      language: 'en',
      extractedRequirements: {
        bhk: '2 BHK',
        budgetMin: 65,
        budgetMax: 75,
      },
      messages: [
        {
          id: 'M-1',
          sender: 'user',
          text: 'Can I combine two 2-BHK apartments into a single 4-BHK on the 10th floor?',
          timestamp: '2026-11-01T14:33:00Z',
          language: 'en',
          isFlaggedForAudit: true,
          flagReason: 'User inquired about custom structural combination (off Fact Sheet).',
        },
        {
          id: 'M-2',
          sender: 'assistant',
          text: 'I want to provide 100% verified facts. I have noted this inquiry and our Senior Sales Advisor will confirm directly with you.',
          timestamp: '2026-11-01T14:33:15Z',
          language: 'en',
        },
      ],
      status: 'EscalatedToHuman',
      assignedExecutiveId: 'EXEC-04',
      flaggedForSalesHead: true,
      flagNotes: 'Off Fact Sheet query: Flat combination feasibility.',
      createdAt: '2026-11-01T14:32:00Z',
      updatedAt: '2026-11-01T14:35:00Z',
    },
  ]);

  /**
   * Sends a user message and generates an AI grounded response with typing delay simulation.
   */
  const sendMessage = async (userText: string, activeFactSheet = MASTER_FACT_SHEET[currentProject]) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}-U`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate realistic sub-second AI concierge thinking time (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const response = generateGroundedResponse(userText, currentProject, activeFactSheet, language);

    const botMsg: ChatMessage = {
      id: `MSG-${Date.now()}-A`,
      sender: 'assistant',
      text: response.responseText,
      timestamp: new Date().toISOString(),
      language,
      detectedIntent: response.detectedIntent,
      toolCallTriggered: response.toolCallTriggered,
      isFlaggedForAudit: response.isFlaggedForAudit,
      flagReason: response.flagReason,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);

    if (response.isFlaggedForAudit) {
      const flaggedConv: BuyerConversation = {
        conversationId: `CONV-${Date.now()}`,
        leadId: `LD-${Math.floor(10000 + Math.random() * 90000)}`,
        currentProjectId: currentProject,
        language,
        extractedRequirements: {
          hasRequestedHuman: response.detectedIntent === 'REQUEST_HUMAN',
        },
        messages: [...messages, userMsg, botMsg],
        status: response.detectedIntent === 'REQUEST_HUMAN' ? 'EscalatedToHuman' : 'Active',
        flaggedForSalesHead: true,
        flagNotes: response.flagReason || 'Flagged for sales head review',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setFlaggedConversations((prev) => [flaggedConv, ...prev]);
    }

    return response;
  };

  /**
   * Clears the active chat thread.
   */
  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return {
    messages,
    language,
    setLanguage,
    currentProject,
    setCurrentProject,
    isTyping,
    sendMessage,
    resetChat,
    flaggedConversations,
  };
}

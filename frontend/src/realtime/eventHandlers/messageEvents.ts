import { MessageEvent, MessageDeletedEvent } from '../../types';
import { EVENT_TYPES, MESSAGE_STATUS } from '../../config';
import { messageStore } from '../../storage';

export const handleMessageEvents = (event: any): void => {
  switch (event.type) {
    case EVENT_TYPES.MESSAGE_SENT:
    case EVENT_TYPES.MESSAGE_RECEIVED:
      handleMessageReceived(event as MessageEvent);
      break;
      
    case EVENT_TYPES.MESSAGE_UPDATED:
      handleMessageUpdated(event as MessageEvent);
      break;
      
    case EVENT_TYPES.MESSAGE_DELETED:
      handleMessageDeleted(event as MessageDeletedEvent);
      break;
      
    default:
      console.warn('Unknown message event type:', event.type);
  }
};

const handleMessageReceived = async (event: MessageEvent): Promise<void> => {
  const { message } = event.data;
  
  await messageStore.addMessage({
    ...message,
    timestamp: new Date(message.timestamp),
    status: MESSAGE_STATUS.SENT,
  });
};

const handleMessageUpdated = async (event: MessageEvent): Promise<void> => {
  const { message } = event.data;
  
  await messageStore.addMessage({
    ...message,
    timestamp: new Date(message.timestamp),
    status: MESSAGE_STATUS.SENT,
  });
};

const handleMessageDeleted = async (event: MessageDeletedEvent): Promise<void> => {
  const { messageId } = event.data;
  await messageStore.deleteMessage(messageId);
};
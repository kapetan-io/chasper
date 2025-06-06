import { WebSocketEvent } from '../../types';
import { EVENT_TYPES } from '../../config';
import { handleMessageEvents } from './messageEvents';

export const eventRouter = (event: WebSocketEvent): void => {
  try {
    switch (event.type) {
      case EVENT_TYPES.MESSAGE_SENT:
      case EVENT_TYPES.MESSAGE_RECEIVED:
      case EVENT_TYPES.MESSAGE_UPDATED:
      case EVENT_TYPES.MESSAGE_DELETED:
        handleMessageEvents(event);
        break;
        
      case EVENT_TYPES.CHANNEL_CREATED:
      case EVENT_TYPES.CHANNEL_UPDATED:
        // Handle channel events
        console.log('Channel event:', event);
        break;
        
      case EVENT_TYPES.USER_TYPING:
        // Handle typing events
        console.log('Typing event:', event);
        break;
        
      case EVENT_TYPES.USER_ONLINE:
      case EVENT_TYPES.USER_OFFLINE:
        // Handle user status events
        console.log('User status event:', event);
        break;
        
      default:
        console.warn('Unknown event type:', (event as any).type);
    }
  } catch (error) {
    console.error('Error handling event:', error, event);
  }
};
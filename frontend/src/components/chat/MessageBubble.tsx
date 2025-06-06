import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Message, User } from '../../types';
import { MESSAGE_STATUS } from '../../config';

interface MessageBubbleProps {
  message: Message;
  author: User;
  isOwnMessage: boolean;
  onRetry?: () => void;
  onDelete?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  author,
  isOwnMessage,
  onRetry,
  onDelete,
}) => {
  const getStatusColor = () => {
    switch (message.status) {
      case MESSAGE_STATUS.PENDING:
        return '#999';
      case MESSAGE_STATUS.FAILED:
        return '#ff4444';
      case MESSAGE_STATUS.SENT:
      case MESSAGE_STATUS.DELIVERED:
      case MESSAGE_STATUS.READ:
        return '#000';
      default:
        return '#000';
    }
  };

  const handleLongPress = () => {
    if (message.status === MESSAGE_STATUS.FAILED && onRetry) {
      onRetry();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}
      onLongPress={handleLongPress}
      disabled={message.status !== MESSAGE_STATUS.FAILED}
    >
      <View style={styles.bubble}>
        {!isOwnMessage && (
          <Text style={styles.author}>{author.username}</Text>
        )}
        
        <Text style={[styles.content, { color: getStatusColor() }]}>
          {message.content}
        </Text>
        
        <View style={styles.metadata}>
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          
          {isOwnMessage && (
            <Text style={styles.status}>
              {message.status === MESSAGE_STATUS.PENDING && '⏰'}
              {message.status === MESSAGE_STATUS.FAILED && '❌'}
              {message.status === MESSAGE_STATUS.SENT && '✓'}
              {message.status === MESSAGE_STATUS.DELIVERED && '✓✓'}
              {message.status === MESSAGE_STATUS.READ && '✓✓'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 12,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 8,
  },
  author: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  content: {
    fontSize: 16,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  status: {
    fontSize: 12,
    marginLeft: 4,
  },
});
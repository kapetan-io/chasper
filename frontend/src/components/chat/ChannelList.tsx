import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Channel } from '../../types';

interface ChannelListProps {
  channels: Channel[];
  currentChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  onSelect: () => void;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.channelItem, isSelected && styles.selectedChannel]}
      onPress={onSelect}
    >
      <View style={styles.channelInfo}>
        <Text style={[styles.channelName, isSelected && styles.selectedChannelText]}>
          # {channel.name}
        </Text>
        
        {channel.description && (
          <Text style={[styles.channelDescription, isSelected && styles.selectedChannelText]}>
            {channel.description}
          </Text>
        )}
        
        {channel.lastMessage && (
          <Text style={[styles.lastMessage, isSelected && styles.selectedChannelText]}>
            {channel.lastMessage.content}
          </Text>
        )}
      </View>
      
      <View style={styles.channelMeta}>
        {channel.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>
              {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
            </Text>
          </View>
        )}
        
        <Text style={[styles.timestamp, isSelected && styles.selectedChannelText]}>
          {new Date(channel.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  currentChannelId,
  onChannelSelect,
  onRefresh,
  isRefreshing = false,
}) => {
  const renderChannel = ({ item }: { item: Channel }) => (
    <ChannelItem
      channel={item}
      isSelected={item.id === currentChannelId}
      onSelect={() => onChannelSelect(item.id)}
    />
  );

  if (channels.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No channels available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={channels}
      renderItem={renderChannel}
      keyExtractor={(item) => item.id}
      style={styles.container}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  channelItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedChannel: {
    backgroundColor: '#e3f2fd',
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  channelDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
  },
  selectedChannelText: {
    color: '#1976d2',
  },
  channelMeta: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  unreadBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 16,
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
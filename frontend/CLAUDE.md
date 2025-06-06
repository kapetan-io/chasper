# Chasper Frontend

React Native chat app with real-time messaging and offline support.

## Architecture

- **Optimistic UI**: Messages appear immediately with status indicators
- **Real-time**: WebSocket-based live updates
- **Offline-first**: Local storage with background sync
- **TypeScript**: Full type safety

## Structure

```
src/
├── config/         # Configuration
├── types/          # TypeScript types
├── services/       # API integration
├── storage/        # Local persistence
├── realtime/       # WebSocket handling
├── context/        # React providers
├── hooks/          # Custom hooks
└── components/     # UI components
```

## Development

```bash
# Install dependencies
npm install

# Start development
expo start

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Testing

- Unit: API, storage, WebSocket logic
- Integration: Context and hook interactions  
- Component: UI behavior and rendering
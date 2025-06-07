# Chasper Frontend

React Native chat app with real-time messaging and offline support.

## Architecture

- Optimistic UI: Messages appear immediately with status indicators
- Real-time: WebSocket-based live updates
- Offline-first: Local storage with background sync
- TypeScript: Full type safety

## Core Technologies

- React Native: Cross-platform mobile development
- Expo: Development platform and deployment
- TypeScript: Type safety and developer experience
- Expo Router: File-based routing system
- Tailwind CSS: CSS Framework
- TanStack Query (React Query)

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
CI=1 npx export start --web --port 3000

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Testing

- Unit: API, storage, WebSocket logic
- Integration: Context and hook interactions  
- Component: UI behavior and rendering

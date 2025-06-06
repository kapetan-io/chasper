# 2. Design Goals

Date: 2025-06-06

## Status

Accepted

## Context

Current social media platforms prioritize revenue over giving users control,
forcing social norms which grow market share instead of providing a platform
which mirrors human social norms. Existing communication tools lack user 
autonomy and data ownership, creating friction in natural human interactions.

The Chasper project aims to fundamentally change how digital communication
works by putting control back in users' hands by enabling zero-friction
connections similar to real-world interactions.

## Decision

We establish the following core design goals for the Chasper project:

### 1. User Control
- Users control their communication, connections, and data
- Individual choice over what content they see and how they interact
- Privacy controls for anonymous vs. identified interactions
- Self-hosting capabilities for complete data ownership

### 2. Zero Friction Communication
- QR code scanning for instant chat connections without the need for registration
- Low barrier entry similar to real-world interactions
- Seamless app/web experience based on user preference
- Sub-100ms message delivery for real-time communication

### 3. Open Source Transparency
- Full transparency through open source development
- Community-driven development and contribution
- Apache License 2.0 for maximum compatibility
- Plugin architecture for extensibility

### 4. Data Ownership
- Users own their data completely
- Self-hosting options available
- No vendor lock-in or proprietary data formats
- Export capabilities for user data

### 5. Customizable Experience
- Extensive plugin system for power users
- Theme marketplace and visual customization
- Simple defaults with advanced options available
- Obsidian-style customization philosophy

### 6. Performance First
- Real-time message delivery (sub-100ms)
- Smooth 60fps animations
- Minimal battery and network usage
- Offline functionality support

### 7. Tech Artifacts
- Low Complexity Data Model
- Functional testing First
- API First development
- Few opinions on database
- Focus on well architected code and less on implementation 
- Design for horizontal scaling first
- Design for effeciency

## Consequences

### Benefits
- User Empowerment: Users gain unprecedented control over their digital communication
- Adoption Ease: Zero-friction connection enables viral growth through natural sharing
- Community Trust: Open source approach builds user confidence and developer community
- Future-Proof: Plugin architecture and data ownership prevent platform lock-in
- Performance: Focus on speed creates superior user experience

### Mitigation Strategies
- Start with simple core features before adding plugin complexity
- Provide clear security guidelines and tooling for self-hosters

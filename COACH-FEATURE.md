# Coach Feature

A new "Managing-Up Coach" feature has been added to the task management app.

## Overview

The Coach feature helps users improve their communication and management skills by analyzing conversation summaries and providing personalized recommendations.

## Features

- **Conversation Analysis**: Enter a summary of a conversation with your manager or team
- **Rubric Scoring**: Rate 7 key communication areas (1-5 scale):
  - Intent: Clarity of your message
  - Framing: How you presented the information
  - Alignment: How well aligned you were with goals
  - Boundaries: How well you set expectations
  - Concision: How concise your communication was
  - Follow: How well you followed up
  - Tone: How appropriate your tone was
- **Plus/Delta Reflection**: Optional fields to capture what went well and what to improve
- **Smart Recommendations**: Get 2-4 personalized recommendations based on your scores
- **Kanban Integration**: TASK recommendations are automatically added to your task board

## How to Use

1. Click the "Coach" tab in the main navigation
2. Enter a conversation summary
3. Adjust the 7 sliders to rate your performance
4. Optionally add notes about what went well (plus) and what to improve (delta)
5. Click "Save & Generate" to get recommendations

## Recommendation Types

- **EXERCISE**: Practice activities to improve skills
- **READ**: Educational resources to study
- **SCRIPT**: Templates and phrases to use
- **TASK**: Action items that get added to your Kanban board

## Database Schema

The feature uses two new Supabase tables:

- `conversations`: Stores conversation summaries and rubric scores
- `recommendations`: Stores generated recommendations with optional Kanban integration

## Files Added

- `lib/coach/rules.ts`: Recommendation logic based on rubric scores
- `app/api/coach/conversations/route.ts`: API endpoint for saving conversations
- `src/components/CoachPage.tsx`: Main Coach interface component
- `supabase-coach-tables.sql`: Database schema for Coach tables

## Integration

The Coach feature integrates with the existing:
- Supabase database
- Kanban task system (for TASK recommendations)
- App navigation and styling
- UI components and design system

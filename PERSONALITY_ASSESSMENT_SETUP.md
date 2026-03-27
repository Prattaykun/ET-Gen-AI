# User Personality Assessment & Personalized Recommendations

## What Was Implemented

### 1. **Users Table in Supabase**
Created a new `users` table with the following fields:
- `id` - UUID reference to auth.users
- `email` - User email
- `personality_completed` - Boolean flag to track assessment completion
- `personality_traits` - JSONB storing all trait responses
- `investment_style` - User's investment approach
- `risk_tolerance` - How user handles market volatility
- `investment_goals` - Array of financial goals
- `preferred_industries` - Array of industries user is interested in
- `news_categories` - Array of news preferences
- Auto-managed `created_at` and `updated_at` timestamps

### 2. **Personality Assessment Page**
Created `/src/app/assessment/page.tsx` - A beautiful, modern one-by-one assessment with:
- **No header** - Clean, minimal design focusing on questions only
- **8 Smart Questions** covering:
  - Investment approach & experience
  - Risk tolerance
  - Financial goals
  - Industry interests
  - News consumption preferences
- **Modern Shadcn UI Design** with:
  - Progress bar at the top showing completion %
  - Radio button selections with visual feedback
  - Smooth transitions and animations
  - Previous/Next navigation buttons
  - Completion status with auto-redirect
- **Single selected answer per question** (except multi-select for industries/goals)
- **Auto-save to database** upon completion

### 3. **Personality Questions Data**
Created `/src/data/personalityQuestions.ts` containing:
- 8 structured questions with multiple choice options
- Question categories: investment, risk, goals, news
- Trait-based mapping for database storage
- Reusable PersonalityProfile interface

### 4. **Enhanced Database Functions**
Updated `/src/data/db.ts` with new functions:

```typescript
// Fetch user's personality profile
getUserPersonality(supabase, userId)

// Get personalized articles based on personality
getPersonalizedArticles(supabase, personality)
```

The personalization algorithm:
- Scores articles based on preferred industries (+3 points)
- Matches news category preferences (+2 points)
- Aligns with investment goals (+2 points)
- Adds recency bonus (up to +5 points)
- Returns top 10 articles sorted by score

### 5. **Discover Page Updates**
Modified `/src/app/page.tsx`:
- **Redirect Check**: New users without completed assessment are redirected to `/assessment`
- **Personalized Recommendations**: New "Recommended for You" section showing articles matched to user personality
- **Sparkles Icon**: Highlights the personalized section
- **Fallback**: Shows all articles if no personality data exists
- **Two-Section Layout**:
  - "Recommended for You" (personality-based)
  - "Curated for: [investment goals]" (existing section)

## How It Works

### User Flow
1. **New User Signs In** → Checks if personality assessment is complete
2. **If Not Complete** → Redirects to `/assessment` page
3. **User Completes Assessment** → One question at a time, modern UI
4. **Data Saved** → Profile stored in users table
5. **Return to Discover** → Shows personality-based "Recommended for You" articles
6. **Returning Users** → Skip assessment, get instant personalized feed

### Personalization Algorithm
The system scores articles on:
- **Industry Match**: Articles mentioning user's preferred industries get +3 points
- **Category Match**: Articles in user's preferred news categories get +2 points
- **Goal Alignment**: Content matching investment goals gets +2 points
- **Recency Bonus**: Newer articles score higher (up to +5 points based on age)

Articles are ranked by total score and top 10 are displayed.

## Files Created
- `/src/app/assessment/page.tsx` - Assessment page component
- `/src/data/personalityQuestions.ts` - Questions and types data

## Files Modified
- `/src/data/db.ts` - Added getUserPersonality & getPersonalizedArticles
- `/src/app/page.tsx` - Added personality check, personalized articles section
- Supabase Database - Created users table

## Database Schema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  personality_traits JSONB,
  personality_completed BOOLEAN DEFAULT FALSE,
  news_categories TEXT[],
  investment_style TEXT,
  risk_tolerance TEXT,
  investment_goals TEXT[],
  preferred_industries TEXT[]
);
```

## Features
✅ Clean, header-free assessment page
✅ One-by-one question display
✅ Modern Shadcn UI styling
✅ Multiple choice questions with visual feedback
✅ Auto-save to database on completion
✅ Automatic redirect for new users
✅ Smart article personalization algorithm
✅ "Recommended for You" section on discover page
✅ Fallback for users without assessment
✅ Progress tracking

## Future Enhancements
- Allow users to retake assessment to update preferences
- Add assessment insights/summary after completion
- Save assessment in user profile for editing
- A/B test different personalization algorithms
- Add machine learning for better recommendations

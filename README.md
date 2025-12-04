# Harvey Messaging App

A modern messaging application built with Next.js, React, and Supabase.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)
- A Supabase project set up

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

Or if you're using npm:
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings:
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" and "anon public" key

### 3. Set Up Database

Run the SQL scripts in the `scripts/` directory in order:
1. `001_messaging_schema.sql` - Creates the main messaging tables
2. `002_create_storage.sql` - Sets up file storage buckets
3. `003_call_tracking.sql` - Creates call tracking tables
4. `004_add_missing_features.sql` - Adds additional features

You can run these in your Supabase SQL Editor.

### 4. Start the Development Server

```bash
pnpm dev
```

Or with npm:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and Supabase clients
- `scripts/` - Database migration scripts
- `public/` - Static assets

## Features

- Real-time messaging
- User authentication
- Group chats
- Voice and video calls
- File sharing
- Notifications
- Dark mode support

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

# HarveyMessenger

# Shift Scheduler

A Nuxt 3 application with Firebase and Tailwind CSS integration.

## Features

- ⚡ Nuxt 3 with Vue 3
- 🔥 Firebase integration (Auth, Firestore, Storage)
- 🎨 Tailwind CSS for styling
- 🛠️ TypeScript support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase project credentials from the Firebase Console

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Firebase Configuration

The application uses Firebase for:
- Authentication (`$auth`)
- Firestore Database (`$db`)
- Storage (`$storage`)

Access Firebase services in your components using:
```vue
<script setup>
const { $auth, $db, $storage } = useNuxtApp()
</script>
```

## Project Structure

```
├── assets/
│   └── css/
│       └── main.css          # Tailwind CSS imports
├── layouts/
│   └── default.vue           # Default layout
├── pages/
│   └── index.vue             # Home page
├── plugins/
│   └── firebase.client.ts    # Firebase plugin
├── firebase.config.ts        # Firebase configuration
├── nuxt.config.ts            # Nuxt configuration
└── tailwind.config.js        # Tailwind configuration
```

## Environment Variables

Create a `.env` file with your Firebase credentials:
```
NUXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NUXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

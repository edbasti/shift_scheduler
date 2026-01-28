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
   - Fill in the Firebase project credentials from the Firebase Console

3. Run the development server:
```bash
npm run dev
```

4. Go to http://localhost:3000/setup to Initialize Demo Data, then you can now go to http://localhost:3000/login using the demo credentials

5. Build for production:
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

## Testing

- **Unit tests (Jest)**  
  Run `npm run test` or `npm run test:unit`.  
  Tests live in `tests/unit/` and cover composables, types, and components (with mocked Nuxt/Firebase).

- **Integration / E2E (Cypress)**  
  Start the app (`npm run dev`), then run:

  - Headless: `npm run test:e2e`
  - Interactive: `npm run test:e2e:open`

  Specs are in `cypress/e2e/`. `baseUrl` is `http://localhost:3000` (see `cypress.config.ts`).

## Environment Variables

Create a `.env` file with the Firebase credentials from .env.example:
```
NUXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NUXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

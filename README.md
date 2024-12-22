# Property Management

A modern web application for managing properties, built with React, TypeScript, and Firebase.

## Tech Stack

- React 18
- TypeScript
- Vite
- Firebase
- Chakra UI
- Tailwind CSS
- React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nirbeaver/property-management.git
cd property-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
```bash
npm run firebase:login
npm run firebase:init
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run deploy` - Build and deploy to Firebase hosting

## Deployment

The application is deployed on Firebase Hosting and can be accessed at:
[https://property-management-bfe6d.web.app/](https://property-management-bfe6d.web.app/)

Deployment is automated through GitHub Actions. Every push to the main branch triggers a new deployment.

## License

MIT

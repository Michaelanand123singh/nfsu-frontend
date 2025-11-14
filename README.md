# NFSU Guest House Booking System - Frontend

A modern, responsive web application for booking guest house rooms at the National Forensic Sciences University (NFSU), Gandhinagar. This frontend application provides an intuitive interface for users to browse available rooms, check availability by date, and make bookings.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [API Integration](#api-integration)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)
- [Key Components](#key-components)
- [Authentication Flow](#authentication-flow)
- [Room Booking Flow](#room-booking-flow)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The NFSU Guest House Booking System is a full-stack application designed to streamline the room booking process for visitors, academic guests, and conference attendees. The frontend is built with React, TypeScript, and modern UI components, providing a seamless user experience across all devices.

### Key Highlights

- **Real-time Room Availability**: Check room availability for specific date ranges
- **User Authentication**: Secure login and registration system
- **Room Management**: Browse single and double occupancy rooms with detailed information
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **AI Chat Support**: Integrated AI assistant for booking assistance (beta)

## ✨ Features

### Core Functionality

- **Room Browsing**
  - View single and double occupancy rooms
  - Filter rooms by floor and block
  - Real-time availability status (Vacant, Booked, Held)
  - Visual room grid with color-coded status indicators

- **Booking System**
  - Date-based availability checking
  - Room selection with detailed information
  - Booking form with guest details
  - Automatic booking submission after authentication

- **User Authentication**
  - User registration with email verification
  - Secure login with JWT tokens
  - Session management with automatic token refresh
  - Protected routes for authenticated users

- **Dashboard & Statistics**
  - Real-time room statistics on homepage
  - Availability summary for selected dates
  - Room occupancy rates and availability indicators

- **AI Chat Assistant** (Beta)
  - Interactive chat panel for booking assistance
  - Context-aware responses (placeholder implementation)

### User Experience

- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Comprehensive error messages and fallback states
- **Toast Notifications**: User-friendly feedback for all actions
- **Smooth Animations**: Fade-in and scale animations for enhanced interactivity

## 🛠 Tech Stack

### Core Technologies

- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript 5.8.3**: Type-safe development
- **Vite 5.4.19**: Fast build tool and development server
- **React Router DOM 6.30.1**: Client-side routing

### UI & Styling

- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components built on Radix UI
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **tailwindcss-animate**: Animation utilities

### State Management & Data Fetching

- **TanStack React Query 5.83.0**: Server state management and caching
- **React Context API**: Global state management (Authentication)

### Form Handling

- **React Hook Form 7.61.1**: Performant form library
- **Zod 3.25.76**: Schema validation
- **@hookform/resolvers**: Form validation resolvers

### Additional Libraries

- **date-fns 3.6.0**: Date manipulation and formatting
- **sonner 1.7.4**: Toast notifications
- **recharts 2.15.4**: Charting library (for future analytics)

## 📁 Project Structure

```
nfsu-frontend/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/            # Images and media files
│   │   ├── campus-hero.jpg
│   │   ├── d.jpg
│   │   └── nfsu.jpg
│   ├── components/        # React components
│   │   ├── ai/           # AI chat components
│   │   │   └── ChatPanel.tsx
│   │   ├── auth/         # Authentication components
│   │   │   ├── LoginModal.tsx
│   │   │   └── RegisterModal.tsx
│   │   ├── booking/      # Booking-related components
│   │   │   ├── BookingModal.tsx
│   │   │   └── RoomTypeModal.tsx
│   │   ├── layout/       # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── room/         # Room display components
│   │   │   ├── FloorTabs.tsx
│   │   │   ├── RoomBox.tsx
│   │   │   └── RoomGrid.tsx
│   │   └── ui/           # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ... (40+ UI components)
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── data/            # Mock data (if any)
│   │   └── mockData.ts
│   ├── hooks/           # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useRoomStats.ts
│   ├── lib/            # Utility libraries
│   │   ├── api.ts      # API client and types
│   │   └── utils.ts    # Helper functions
│   ├── pages/          # Page components
│   │   ├── Index.tsx   # Homepage
│   │   ├── NotFound.tsx
│   │   └── RoomsPage.tsx
│   ├── App.tsx         # Main app component
│   ├── App.css         # Global styles
│   ├── index.css       # Tailwind imports and CSS variables
│   └── main.tsx        # Application entry point
├── .gitignore
├── components.json     # shadcn/ui configuration
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── tsconfig.app.json   # App-specific TypeScript config
├── tsconfig.node.json  # Node-specific TypeScript config
├── vercel.json         # Vercel deployment configuration
└── vite.config.ts      # Vite configuration
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nfsu-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (if needed)
   - Create a `.env` file in the root directory
   - Add any required environment variables (see [Environment Configuration](#environment-configuration))

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000` (or the port shown in the terminal)

## 💻 Development

### Available Scripts

- **`npm run dev`**: Start the development server with hot module replacement
- **`npm run build`**: Build the application for production
- **`npm run build:dev`**: Build in development mode
- **`npm run preview`**: Preview the production build locally
- **`npm run lint`**: Run ESLint to check code quality

### Development Server

The development server runs on `http://localhost:3000` by default. The server supports:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Source maps for debugging

### Code Style

The project uses:
- **ESLint**: For code linting and quality checks
- **TypeScript**: For type safety
- **Prettier**: (if configured) for code formatting

## 🏗 Building for Production

### Build Command

```bash
npm run build
```

This command:
- Compiles TypeScript to JavaScript
- Bundles and minifies the code
- Optimizes assets
- Generates production-ready files in the `dist/` directory

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## 🔌 API Integration

The application integrates with a backend API hosted at:
```
https://nfsu-college-backend.onrender.com/api
```

### API Client

The API client is located in `src/lib/api.ts` and provides methods for:

#### Authentication
- `login(credentials)`: User login
- `register(userData)`: User registration
- `logout()`: User logout
- `getCurrentUser()`: Get current authenticated user
- `updateProfile(updates)`: Update user profile
- `changePassword(currentPassword, newPassword)`: Change password

#### Rooms
- `getRooms(params)`: Get rooms with filters
- `getRoomStats()`: Get room statistics
- `getFloorData()`: Get floor information
- `getRoom(id)`: Get specific room details
- `getRoomAvailability(params)`: Check room availability for dates

#### Bookings
- `createBooking(bookingData)`: Create a new booking
- `getBookings(params)`: Get user bookings
- `getBooking(id)`: Get specific booking details
- `updateBooking(id, updates)`: Update booking
- `cancelBooking(id, reason)`: Cancel a booking

### API Response Format

All API responses follow this structure:
```typescript
{
  status: 'success' | 'error',
  message?: string,
  data?: T,
  errors?: any[]
}
```

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are:
- Stored in `localStorage` as `authToken`
- Automatically included in API requests via `Authorization` header
- Refreshed automatically when needed

## ⚙️ Environment Configuration

Currently, the API base URL is hardcoded in `src/lib/api.ts`. To use environment variables:

1. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=https://nfsu-college-backend.onrender.com/api
   ```

2. Update `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nfsu-college-backend.onrender.com/api';
   ```

## 🚢 Deployment

### Vercel Deployment

The project is configured for Vercel deployment with `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This configuration ensures all routes are handled by the React Router.

### Deployment Steps

1. **Connect to Vercel**
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the project in Vercel dashboard
   - Configure environment variables if needed

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Vercel will automatically deploy on every push to the main branch
   - Preview deployments are created for pull requests

### Other Deployment Options

The application can be deployed to any static hosting service:
- **Netlify**: Similar to Vercel, supports SPA routing
- **GitHub Pages**: Requires additional configuration for routing
- **AWS S3 + CloudFront**: Static site hosting
- **Any web server**: Serve the `dist/` directory

## 🧩 Key Components

### Pages

- **Index.tsx**: Homepage with hero section, room type cards, and features
- **RoomsPage.tsx**: Room browsing and booking interface with filters
- **NotFound.tsx**: 404 error page

### Layout Components

- **Layout.tsx**: Main layout wrapper with header and footer
- **Header.tsx**: Navigation header with authentication controls

### Room Components

- **RoomGrid.tsx**: Grid display of rooms with status indicators
- **RoomBox.tsx**: Individual room card component
- **FloorTabs.tsx**: Tabbed interface for different floors

### Booking Components

- **BookingModal.tsx**: Modal for creating bookings
- **RoomTypeModal.tsx**: Modal for selecting room type

### Authentication Components

- **LoginModal.tsx**: Login form modal
- **RegisterModal.tsx**: Registration form modal

### Contexts

- **AuthContext.tsx**: Global authentication state management

### Custom Hooks

- **useRoomStats.ts**: Hook for fetching and managing room statistics
- **use-toast.ts**: Hook for toast notifications
- **use-mobile.tsx**: Hook for detecting mobile devices

## 🔐 Authentication Flow

1. **User Registration/Login**
   - User submits credentials via modal
   - API returns JWT token and user data
   - Token stored in localStorage
   - User state updated in AuthContext

2. **Protected Actions**
   - Booking requires authentication
   - If not authenticated, user is prompted to login
   - Booking data is preserved during authentication flow
   - After successful login, booking is automatically submitted

3. **Token Management**
   - Tokens are automatically included in API requests
   - Expired tokens trigger automatic logout
   - Token refresh mechanism for session extension

## 📅 Room Booking Flow

1. **Browse Rooms**
   - User navigates to single or double rooms page
   - Rooms are displayed by floor with status indicators

2. **Filter by Date**
   - User selects check-in and check-out dates
   - API returns availability for selected dates
   - Rooms are color-coded based on availability

3. **Select Room**
   - User clicks on an available room
   - Booking modal opens with room details

4. **Complete Booking**
   - User fills in guest information
   - If not authenticated, login/register modal appears
   - After authentication, booking is submitted
   - Confirmation toast is displayed

## 🎨 Styling & Theming

The application uses:
- **CSS Variables**: For theme customization (defined in `index.css`)
- **Tailwind CSS**: For utility-first styling
- **Custom Animations**: Fade-in, scale-in, and pulse-glow effects
- **Responsive Breakpoints**: Mobile-first design approach

### Color Scheme

- **Primary**: Customizable via CSS variables
- **Room Status Colors**:
  - Vacant: Green (`room-vacant`)
  - Booked: Red (`room-booked`)
  - Held: Orange (`room-held`)

## 🧪 Testing

While no test files are currently included, the project structure supports:
- Unit tests with Vitest or Jest
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Guidelines

- Follow TypeScript best practices
- Use functional components and hooks
- Maintain consistent code style
- Add comments for complex logic
- Update documentation as needed

## 📝 License

This project is proprietary software for the National Forensic Sciences University. All rights reserved.

## 📞 Contact & Support

For support or inquiries:
- **Email**: guesthouse@nfsu.ac.in
- **Phone**: +91 79 2397 5000
- **Address**: Sector 9, Gandhinagar, Gujarat 382007

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Note**: This is the frontend application. Ensure the backend API is running and accessible for full functionality.

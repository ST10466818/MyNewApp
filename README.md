# Happie - Chef Christoffel's Menu App 👨‍🍳

A React Native mobile application that allows Chef Christoffel to manage his restaurant menu digitally. Chef Christoffel can add, view, and filter menu items across different courses.

## Features

- **Menu Management**: Add and remove menu items with details including name, description, course, and price
- **Course Categories**: Organize dishes into Starters, Mains, and Desserts
- **Filter System**: Filter menu items by course for easy navigation
- **Price Analytics**: View average prices for each course category
- **Item Counter**: Track total number of menu items
- **Light/Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Custom Typography**: Features the Anton font for branding

## Technologies Used

- **React Native** - Mobile app framework
- **TypeScript** - Type-safe development
- **Expo** - Development and build tooling
- **Expo Font** - Custom font integration (@expo-google-fonts/anton)

## Prerequisites

Before running this app, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app installed on your mobile device
- Expo CLI

## Installation
1. Clone the repository:
```bash
git clone 
cd Happie
```

2. Install dependencies:
```bash
npm install
```

3. Install required fonts:
```bash
npx expo install expo-font @expo-google-fonts/anton
```
4. Add the chef image to the assets folder:
   - Create an `assets` folder in the project root
   - Add `chef.png` to the `assets` folder

## Running the App

Start the Expo development server:
```bash
npx expo start
```

For school/corporate networks with connection issues:
```bash
npx expo start --tunnel
```

Scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

## User Guide
### Home Screen
- View all menu items organized by course
- See total menu item count
- View average prices per course category
- Toggle light/dark mode with sun/moon icon

### Add to Menu Screen
- Fill in dish details:
  - Name of dish
  - Course selection (Starter/Mains/Desserts)
  - Description
  - Price
- Save items to the menu
- View current menu items
- Delete items by tapping the ❌ icon

### Filter Menu Screen
- View all menu items
- Filter by specific course (All/Starters/Mains/Desserts)
- Browse full dish descriptions and prices
## App Structure
```
Happie/
├── assets/
│   └── chef.png           # Chef Christoffel logo
├── App.tsx                # Main application file
├── package.json           # Dependencies
└── README.md             # This file
```
## FAQ's
...
## Data Structure

Menu items contain the following properties:
```typescript
{
  id: number,
  name: string,
  description: string,
  course: 'Starter' | 'Mains' | 'Desserts',
  price: number,
  pairing?: string
}
```

## Troubleshooting

### Connection Issues
If you encounter "Could not connect to server" errors:
1. Try tunnel mode: `npx expo start --tunnel`
2. Ensure phone and computer are on same WiFi
3. Try LAN mode: `npx expo start --lan`
4. Test in web browser: `npx expo start --web`

### Font Not Loading
If the Anton font doesn't load:
```bash
npx expo install expo-font @expo-google-fonts/anton
```

## Changelog

#### Features Added
- **Menu Management System**
  - Add new menu items with name, description, course, and price
  - Delete menu items from the list
  - Persistent menu storage during session
  
- **Home Screen**
  - Display all menu items organized by course
  - Show total menu item count
  - Calculate and display average prices per course
  - Visual branding with chef image and food showcase
  
- **Add Menu Screen**
  - Form-based menu item creation
  - Course selection with visual buttons (Starter/Mains/Desserts)
  - Multi-line description input
  - Numeric price input
  - Current menu items list with delete functionality
  
- **Filter Menu Screen**
  - Filter menu items by course category
  - "All" option to view complete menu
  - Organized display with course sections
  
#### Design & UI
- **Light/Dark Mode Toggle**
  - Toggle button with sun/moon icons
  - Theme persistence across all screens
  - Dynamic color scheme for optimal readability
  
- **Custom Typography**
  - Anton font integration for "HAPPIE" branding
  - Consistent font hierarchy throughout app
  
- **Visual Elements**
  - Chef Christoffel character image
  - Color-coded food image placeholders
  - Bottom navigation bar with icons
  - Rounded cards and modern UI components

#### Technical Implementation
- **TypeScript Integration**
  - Type-safe menu item structure
  - Proper typing for all functions and states
  - Screen type definitions
  
- **State Management**
  - React hooks (useState) for local state
  - Menu items array management
  - Form state handling
  - Theme state management
  
- **Code Organization**
  - Modular component structure
  - Reusable styled components
  - Clean separation of concerns
  - Well-commented code for maintainability

#### Functions & Logic
- `addMenuItem()` - Adds new menu item to array with validation
- `removeMenuItem()` - Removes menu item by ID
- `calculateAverageByCourse()` - Calculates average price per course
- `getFilteredItems()` - Filters menu items based on selected course
- `getThemedStyles()` - Returns dynamic styles based on theme

#### Dependencies
- react-native: ^0.72.0
- expo: ~49.0.0
- typescript: ^5.1.3
- @expo-google-fonts/anton: Latest
- expo-font: Latest

---

## Acknowledgments

- Chef Christoffel for the concept and branding
- (apps i used for refernce)
- Claude for help in the terminal while tryinghat.expo.dev): Chat with Expo users and ask questions.

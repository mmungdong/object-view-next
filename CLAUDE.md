# Object View Next Project

This project is a modern React application built with Vite, TypeScript, Tailwind CSS, and ESLint. It includes an Alibaba Cloud OSS Object Storage Online Preview Tool.

## Tech Stack

- **Build Tool**: Vite
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Code Quality**: ESLint

## Project Structure

```
project-root/
├── src/
│   ├── components/
│   │   ├── ConfigManager.tsx
│   │   ├── FileBrowser.tsx
│   │   ├── FileList.tsx
│   │   ├── FileItem.tsx
│   │   └── Breadcrumb.tsx
│   ├── hooks/
│   ├── services/
│   │   └── storageService.ts
│   ├── types/
│   │   └── storage.ts
│   ├── utils/
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

## Alibaba Cloud OSS Online Preview Tool

### Features

1. **Storage Bucket Configuration Management**
   - Configuration form with AccessKey, SecretKey, Bucket name, and Region
   - Support for both private and public read buckets
   - Local persistence of configuration information (localStorage)

2. **Folder Navigation**
   - Load and display bucket root directory and subfolder structure
   - Navigate into subfolders and return to parent folders
   - Breadcrumb navigation showing current path

3. **File Listing and Preview**
   - Display file information: name, size (formatted display), last modified time
   - Instant preview for photos: common formats (JPG/PNG/GIF/WebP) show thumbnails
   - Default icons + filename for non-image files (documents, videos, etc.)

4. **User Experience**
   - Loading state indicators during folder switching and file loading
   - Error handling for configuration errors, request failures, and permission issues
   - Layout switching between grid and list views

### Components

- `ConfigManager`: Handles storage configuration management
- `FileBrowser`: Main file browser interface
- `Breadcrumb`: Navigation breadcrumb component
- `FileList`: Displays files in grid or list layout
- `FileItem`: Individual file/folder item component

### Services

- `storageService.ts`: Storage service implementation for OSS with real API calls
- `formatters.ts`: Utility functions for formatting file sizes and dates

### Access Types

The tool supports two types of storage buckets:

1. **Private Buckets**: Require AccessKey and SecretKey for authentication
2. **Public Read Buckets**: Can be accessed without authentication credentials

### Real API Implementation

The storage service uses real APIs for Alibaba Cloud OSS:

- **Alibaba Cloud OSS Service**: Uses `ali-oss` for real API calls

The service implements the `StorageService` interface with:
- `listFiles(prefix: string)`: List files in a directory using real API calls
- `getFileUrl(key: string)`: Generate URL for file access using real API calls

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

Lint the code:
```bash
npm run lint
```

## Configuration Files

### Tailwind CSS

- `tailwind.config.js`: Main configuration file for Tailwind CSS
- `postcss.config.js`: PostCSS configuration with Tailwind and Autoprefixer plugins

**Note**: This project uses Tailwind CSS v4, which requires `@tailwindcss/postcss` as a PostCSS plugin. The configuration is different from previous versions of Tailwind CSS.

### ESLint

- `eslint.config.js`: ESLint configuration with TypeScript and React support

### Vite

- `vite.config.ts`: Vite build tool configuration

## Scripts

- `dev`: Start development server
- `build`: Build for production
- `lint`: Run ESLint
- `preview`: Preview production build locally

## Key Features

- TypeScript for type safety
- Tailwind CSS v4 for styling
- ESLint for code quality
- Vite for fast development and building
- React 19 for UI components
- Real API integration with Alibaba Cloud OSS

## Author

Generated with [Claude Code](https://claude.com/claude-code)

Co-authored-by: Claude <noreply@anthropic.com>
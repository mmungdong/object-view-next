# Object View Next

A modern React application for browsing and previewing files in Alibaba Cloud OSS buckets.

## Features

- Browse files and folders in OSS buckets
- Preview images directly in the browser
- Support for both private and public read buckets
- Responsive design with grid and list view options
- Built with modern web technologies

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, ShadCN UI
- **Cloud Storage**: Alibaba Cloud OSS
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd object-view-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

Lint the code:
```bash
npm run lint
```

## Using ShadCN UI Components

This project integrates ShadCN UI components for a consistent and accessible user interface. To use ShadCN UI components:

1. Import the component:
   ```typescript
   import { Button } from "@/components/ui/button";
   ```

2. Use the component in your JSX:
   ```tsx
   <Button variant="default">Click me</Button>
   ```

## Project Structure

```
src/
├── components/
│   ├── ui/              # ShadCN UI components
│   ├── ConfigManager.tsx # Storage configuration management
│   ├── FileBrowser.tsx  # Main file browser interface
│   ├── FileList.tsx     # File listing component
│   ├── FileItem.tsx     # Individual file item component
│   └── Breadcrumb.tsx   # Navigation breadcrumb
├── lib/                 # Utility functions
├── services/            # OSS service implementation
├── types/               # TypeScript types
├── utils/               # Helper functions
├── App.tsx             # Main application component
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## Configuration

The application supports two types of OSS buckets:

1. **Private Buckets**: Require AccessKey and SecretKey for authentication
2. **Public Read Buckets**: Can be accessed without authentication credentials

Configuration is persisted in localStorage for convenience.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Alibaba Cloud OSS](https://www.alibabacloud.com/product/oss)
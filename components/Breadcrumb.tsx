import type { BreadcrumbItem } from '../types/storage';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

export default function Breadcrumb({ items, onNavigate, onGoBack, canGoBack }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2">
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className={`flex items-center px-3 py-1 rounded ${
          canGoBack
            ? 'text-blue-600 hover:bg-blue-50'
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>

      <span className="text-gray-300">|</span>

      <div className="flex items-center space-x-2">
        {items.map((item, index) => (
          <div key={item.path} className="flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 mx-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <button
              onClick={() => onNavigate(item.path)}
              className={`px-2 py-1 rounded ${
                index === items.length - 1
                  ? 'text-gray-900 font-medium'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
}
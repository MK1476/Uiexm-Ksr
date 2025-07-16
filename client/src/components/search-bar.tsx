import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/language-context';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder || t('searchProducts')}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-4 py-2 w-full"
      />
    </div>
  );
}
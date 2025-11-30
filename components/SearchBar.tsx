import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-32 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-lg transition-all"
          placeholder="Ex: Sofá Cama, Referência 1234..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button
            type="submit"
            disabled={isLoading || !term.trim()}
            className={`px-6 py-2 rounded-lg text-white font-medium text-sm transition-all shadow-md ${
              isLoading || !term.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-orange-600 hover:bg-orange-700 hover:shadow-lg active:transform active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                A procurar...
              </span>
            ) : (
              'Pesquisar'
            )}
          </button>
        </div>
      </form>
      <div className="mt-2 flex justify-center gap-2 text-xs text-gray-500">
        <span>Sugestões:</span>
        <button onClick={() => setTerm('Sofá Cama')} className="hover:text-orange-600 hover:underline">Sofá Cama</button>
        <span>•</span>
        <button onClick={() => setTerm('Mesa de Jantar')} className="hover:text-orange-600 hover:underline">Mesa de Jantar</button>
        <span>•</span>
        <button onClick={() => setTerm('Roupeiro')} className="hover:text-orange-600 hover:underline">Roupeiro</button>
      </div>
    </div>
  );
};
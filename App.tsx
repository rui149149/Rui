import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultsGrid } from './components/ResultsGrid';
import { searchProducts } from './services/geminiService';
import { SearchState } from './types';

const App: React.FC = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isLoading: false,
    data: null,
    error: null,
  });

  const handleSearch = async (query: string) => {
    setSearchState(prev => ({ ...prev, query, isLoading: true, error: null }));
    
    try {
      const results = await searchProducts(query);
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        data: results,
      }));
    } catch (err) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: "Ocorreu um erro ao pesquisar. Por favor, verifique a sua ligação ou tente novamente mais tarde.",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              Encontre o seu mobiliário ideal
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Pesquise por referência, nome ou categoria no catálogo da Moviflor. 
              A nossa IA analisa o site em tempo real para encontrar o que procura.
            </p>
            <SearchBar onSearch={handleSearch} isLoading={searchState.isLoading} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow w-full">
          {searchState.error && (
            <div className="max-w-3xl mx-auto mt-8 px-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{searchState.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!searchState.data && !searchState.isLoading && !searchState.error && (
            <div className="max-w-7xl mx-auto px-4 py-12">
               {/* Empty state / Welcome features */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-500">
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Pesquisa Inteligente</h3>
                    <p className="text-sm">Use referências técnicas (ex: "REF-123") ou linguagem natural.</p>
                  </div>
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Dados em Tempo Real</h3>
                    <p className="text-sm">Os resultados são obtidos diretamente do site da Moviflor no momento da pesquisa.</p>
                  </div>
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Link Direto</h3>
                    <p className="text-sm">Aceda diretamente à página do produto para comprar.</p>
                  </div>
               </div>
            </div>
          )}

          {searchState.data && (
            <ResultsGrid 
              summary={searchState.data.summary} 
              links={searchState.data.links} 
            />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Moviflor Finder AI. Esta aplicação não é afiliada oficialmente à Moviflor.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
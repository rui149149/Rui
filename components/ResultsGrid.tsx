import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchResult } from '../types';

interface ResultsGridProps {
  summary: string;
  links: SearchResult[];
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ summary, links }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://picsum.photos/seed/${Math.random()}/400/200?grayscale`;
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* AI Summary Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <h2 className="font-semibold text-orange-900">Resumo da Pesquisa</h2>
        </div>
        <div className="p-6 text-gray-700 prose prose-orange max-w-none">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>

      {/* Links Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{links.length}</span>
          Produtos e Páginas Encontradas
        </h3>
        
        {links.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhum link direto encontrado para esta referência.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-orange-300 transition-all overflow-hidden h-full"
              >
                <div className="h-48 bg-white relative overflow-hidden flex items-center justify-center border-b border-gray-100 p-4">
                   {link.imageUrl ? (
                     <img 
                       src={link.imageUrl}
                       onError={handleImageError}
                       alt={link.title} 
                       className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                     />
                   ) : (
                     <div className="w-full h-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                       <img 
                        src={`https://picsum.photos/seed/${idx + link.url.length}/400/200`} 
                        alt="Placeholder"
                        className="w-full h-full object-cover opacity-50 mix-blend-multiply"
                       />
                       <span className="absolute text-gray-400 font-medium z-10 bg-white/80 px-2 py-1 rounded text-xs">Sem imagem</span>
                     </div>
                   )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-auto break-all font-mono">
                    {link.domain}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-orange-600 text-sm font-medium">
                    Ver no site 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
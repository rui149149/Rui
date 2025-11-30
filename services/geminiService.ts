import { GoogleGenAI } from "@google/genai";
import { SearchResult, GroundingChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchProducts = async (query: string): Promise<{ summary: string; links: SearchResult[] }> => {
  try {
    // We strictly limit the search to moviflor.pt to act as a catalog lookup
    // We ask the model to extract image URLs and list them in a specific format at the end
    const prompt = `Pesquisa especificamente no site 'moviflor.pt' pelo produto com a referência ou nome: "${query}". 
    
    1. Faz um resumo detalhado do que encontraste, incluindo preços se visíveis e características principais.
    2. Se não encontrares o produto específico, sugere produtos semelhantes encontrados no mesmo site.
    
    INSTRUÇÃO IMPORTANTE SOBRE IMAGENS:
    Tenta identificar o URL da imagem de cada produto encontrado. 
    No final da tua resposta, adiciona uma secção separada (invisível para o utilizador final) iniciada por "---METADATA---".
    Nesta secção, lista o URL do produto e o URL da imagem correspondente separados por um pipe (|), um por linha.
    
    Exemplo do formato final:
    ...texto do resumo...
    
    ---METADATA---
    https://www.moviflor.pt/produto-x|https://www.moviflor.pt/img/produto-x.jpg
    https://www.moviflor.pt/produto-y|https://www.moviflor.pt/img/produto-y.jpg
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is not allowed with googleSearch
      },
    });

    const fullText = response.text || "Não foi possível gerar um resumo.";
    
    // Split the summary and the metadata
    const parts = fullText.split('---METADATA---');
    const summary = parts[0].trim();
    const metadataBlock = parts[1] ? parts[1].trim() : '';

    // Parse the image metadata into a map for easy lookup
    const imageMap = new Map<string, string>();
    if (metadataBlock) {
      metadataBlock.split('\n').forEach(line => {
        const [productUrl, imageUrl] = line.split('|').map(s => s.trim());
        if (productUrl && imageUrl) {
          // Normalize URL for better matching (remove trailing slash, etc if needed)
          // For now, we store the raw URL found by the model
          imageMap.set(productUrl, imageUrl);
        }
      });
    }
    
    // Extract grounding chunks to get the actual links found
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const links: SearchResult[] = chunks
      .map((chunk: GroundingChunk) => {
        if (chunk.web && chunk.web.uri && chunk.web.title) {
          const uri = chunk.web.uri;
          
          // Try to find an image for this URI
          // We check for exact match or if the map key is contained in the URI (or vice versa)
          let imageUrl: string | undefined = imageMap.get(uri);
          
          // Fallback fuzzy matching if exact match fails
          if (!imageUrl) {
            for (const [pUrl, iUrl] of imageMap.entries()) {
              if (uri.includes(pUrl) || pUrl.includes(uri)) {
                imageUrl = iUrl;
                break;
              }
            }
          }

          return {
            title: chunk.web.title,
            url: uri,
            domain: new URL(uri).hostname,
            imageUrl: imageUrl
          };
        }
        return null;
      })
      .filter((item): item is SearchResult => item !== null)
      // Filter duplicates based on URL
      .filter((item, index, self) => 
        index === self.findIndex((t) => t.url === item.url)
      );

    return { summary, links };

  } catch (error) {
    console.error("Erro na pesquisa Gemini:", error);
    throw new Error("Falha ao comunicar com o assistente de pesquisa.");
  }
};
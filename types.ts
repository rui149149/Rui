export interface SearchResult {
  title: string;
  url: string;
  domain: string;
  imageUrl?: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  data: {
    summary: string;
    links: SearchResult[];
  } | null;
  error: string | null;
}
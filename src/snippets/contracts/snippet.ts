export const languages = ['php', 'javascript', 'typescript', 'html', 'css'] as const;

export type Language = (typeof languages)[number];

export interface Snippet {
  id: string;
  title: string;
  language: Language;
  code: string;
  tags: string[];
  createdAt: string;
}

export type SnippetDraft = Omit<Snippet, 'id' | 'createdAt'>;

export type SnippetUpdate = Partial<SnippetDraft>;
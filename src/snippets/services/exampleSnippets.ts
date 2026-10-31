import type { Snippet } from '../contracts/snippets';

export const exampleSnippets: Snippet[] = [
  {
    id: '1',
    title: 'PHP foreach loop',
    language: 'php',
    code: 'foreach ($items as $item) { echo $item; }',
    tags: ['php', 'loop', 'array'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'TypeScript string type',
    language: 'typescript',
    code: 'const name: string = "Dany";',
    tags: ['typescript', 'types'],
    createdAt: new Date().toISOString(),
  },
];
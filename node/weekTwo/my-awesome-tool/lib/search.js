// lib/search.js
import { promises as fs } from 'fs';
import path from 'path';

export async function searchFiles(folder, keyword) {
  const items = await fs.readdir(folder);
  const txtFiles = items.filter(f => f.endsWith('.txt'));
  const results = [];

  for (const file of txtFiles) {
    const content = await fs.readFile(path.join(folder, file), 'utf-8');
    if (content.includes(keyword)) {
      results.push({ file, content: content.substring(0, 100) + '...' });
    }
  }

  return results;
}
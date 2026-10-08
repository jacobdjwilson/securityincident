import YAML from 'yaml';

/**
 * Lightweight, zero-vulnerability frontmatter parser & stringifier.
 * Drop-in replacement for gray-matter using the modern 'yaml' library (YAML 1.2 standard).
 * Eliminates sprintf-js, argparse, and js-yaml@3 vulnerability chain (GHSA-hp3w-g68c-fv3c).
 *
 * @param {string} fileContent - Raw markdown file content
 * @returns {{ data: Record<string, any>, content: string }}
 */
export default function matter(fileContent) {
  if (typeof fileContent !== 'string') fileContent = String(fileContent || '');
  const match = fileContent.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContent };
  }
  try {
    const data = YAML.parse(match[1]) || {};
    return { data, content: match[2] };
  } catch (err) {
    return { data: {}, content: fileContent };
  }
}

/**
 * Stringify frontmatter data and markdown body back to YAML frontmatter format.
 *
 * @param {string} content - Markdown body content
 * @param {Record<string, any>} data - Frontmatter object
 * @returns {string}
 */
matter.stringify = function stringify(content, data) {
  const yamlStr = YAML.stringify(data || {}).trim();
  const body = (content || '').trimStart();
  return `---\n${yamlStr}\n---\n\n${body}`;
};

import path from 'path';

/**
 * Detect the CLI command name from the invocation path.
 * Returns 'splx' as the command name.
 */
export function getCommandName(): string {
  const scriptPath = process.argv[1] || '';
  // Handle both Unix and Windows path separators
  const lastSeparator = Math.max(scriptPath.lastIndexOf('/'), scriptPath.lastIndexOf('\\'));
  const rawScriptName = lastSeparator >= 0 ? scriptPath.slice(lastSeparator + 1) : scriptPath;
  const normalizedScriptName = rawScriptName
    .toLowerCase()
    .replace(/\.(js|cjs|mjs|ts|cmd|exe|bat)$/, '');
  return normalizedScriptName === 'splx' ? 'splx' : 'splx';
}

/**
 * The detected command name for the current invocation.
 */
export const commandName = getCommandName();

'use client';

import { useState } from 'react';

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable - the command is still selectable/copyable by hand.
    }
  };

  return (
    <button type="button" className="copy-command" onClick={handleCopy}>
      <code>{command}</code>
      <span className="copy-command-icon">{copied ? '✓ Copié' : '⧉'}</span>
    </button>
  );
}

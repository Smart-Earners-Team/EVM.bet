import React from "react";
import { RiFileCopyLine, RiCheckLine } from "react-icons/ri";
import { FaPaste } from "react-icons/fa";

export const copyText = (text: string, cb?: () => void) => {
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(text).then(cb);
  } else if (document.queryCommandSupported("copy")) {
    const ele = document.createElement("textarea");
    ele.value = text;
    document.body.appendChild(ele);
    ele.select();
    document.execCommand("copy");
    document.body.removeChild(ele);
    cb?.();
  }
};

export function CopyToClipboard({
  targetId,
  className,
}: {
  targetId: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyClick = () => {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const textToCopy = targetElement.textContent;
      if (textToCopy) {
        copyText(textToCopy, () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000); // Reset the copied state after 3 seconds
        });
      }
    }
  };

  return (
    <button className="text-xl" onClick={handleCopyClick}>
      {copied ? (
        <RiCheckLine className={className} />
      ) : (
        <RiFileCopyLine className={className} />
      )}
      {/* {copied ? 'Copied' : 'Copy'} */}
    </button>
  );
}
interface Props {
  targetId: string;
  onPaste?: (value: string) => void; // Adding this prop
}

export function PasteFromClipboard({ targetId, onPaste }: Props) {
  const [pasted, setPasted] = React.useState(false);

  const handlePasteClick = async () => {
    try {
      const clipboardData = await navigator.clipboard.readText();
      const targetElement = document.getElementById(targetId);

      if (
        targetElement &&
        (targetElement instanceof HTMLInputElement ||
          targetElement instanceof HTMLTextAreaElement)
      ) {
        targetElement.value = clipboardData;
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);

        onPaste && onPaste(clipboardData); // Invoke the onPaste callback
      } else {
        console.error("Target element not found or not an input field.");
      }
    } catch (error) {
      console.error("Failed to read clipboard data: ", error);
    }
  };

  return (
    <button type="button" className="text-xl" onClick={handlePasteClick}>
      {pasted ? <RiCheckLine /> : <FaPaste />}
    </button>
  );
}

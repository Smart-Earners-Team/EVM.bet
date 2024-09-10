export function formatToSubExponential(value: string | number): JSX.Element {
  let stringValue = String(value);
  const decimalPos = stringValue.indexOf(".");

  // If no decimal point and the number is greater than 1, format to four decimal places
  if (decimalPos === -1 && Number(stringValue) > 1) {
    return (
      <span className="flex items-center text-sm">
        {Number(stringValue).toFixed(4)}
      </span>
    );
  }

  // Extract decimal and fractional parts
  const decimalPart = stringValue.substring(0, decimalPos);
  const fractionalPart = stringValue.substring(decimalPos + 1);

  // Count leading zeros in the fractional part, excluding the first digit
  const fractionalLeadingZerosMatch = fractionalPart.slice(1).match(/^0+/);
  const fractionalLeadingZeros = fractionalLeadingZerosMatch
    ? fractionalLeadingZerosMatch[0].length
    : 0;

  // Determine how to display the fractional part
  let displayFractionalPart;
  if (fractionalLeadingZeros > 3) {
    // Extract the non-zero part after the leading zeros
    const nonZeroFractionalPart = fractionalPart
      .slice(1 + fractionalLeadingZeros)
      .slice(0, 4);
    displayFractionalPart = (
      <>
        {fractionalPart.charAt(0)}
        <sub className="font-bold">{fractionalLeadingZeros}</sub>
        {nonZeroFractionalPart}
      </>
    );
  } else {
    // Otherwise, show the full fractional part, fixed to 5 decimal places
    displayFractionalPart =
      fractionalPart.length > 5 ? fractionalPart.slice(0, 5) : fractionalPart;
  }

  // Return the formatted number
  return (
    <span className="text-sm">
      {decimalPart}.{displayFractionalPart}
    </span>
  );
}

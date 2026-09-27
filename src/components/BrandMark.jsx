/**
 * The FocusedAntics wordmark. "Focused" upright and precise, "Antics" in the
 * italic cut — the two halves of the name, set as one word.
 * Pure text: crisp at every size, selectable, and the fallback for LiquidLogo.
 */
export default function BrandMark({ className = '' }) {
  return (
    <span className={`brandmark ${className}`}>
      <span className="brandmark__focused">Focused</span>
      <span className="brandmark__antics">Antics</span>
    </span>
  )
}

/**
 * Form field wrapper with label.
 * Wraps any input, select, or textarea with a consistent label style.
 */
export default function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-textcolor mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

// Shared input class — import and reuse across forms
export const inputClass = "w-full text-textcolor2 px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
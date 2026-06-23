/**
 * Reusable toggle switch component.
 * Used for availability (professional) and urgent flag (job post).
 */
export default function Toggle({ enabled, onChange, label, description, activeColor = 'bg-primary' }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          enabled ? activeColor : 'bg-gray-300'
        }`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
          enabled ? 'left-7' : 'left-1'
        }`} />
      </button>
    </div>
  )
}
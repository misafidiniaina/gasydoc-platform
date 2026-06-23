/**
 * Displays a single stat with SVG icon, value and label.
 */
export default function StatCard({ label, value, icon, highlight, text }) {
  return (
    <div className="bg-white rounded-sm py-5 px-6">
      <div className="mb-3 text-primary">{icon}</div>
      <p className={`${text ?'text-[1.25rem]' : 'text-[1.4rem]'} font-regular ${highlight ? 'text-textcolor' : 'text-textcolor'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  )
}
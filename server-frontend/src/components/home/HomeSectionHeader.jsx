import { Link } from 'react-router-dom'

const HomeSectionHeader = ({ eyebrow, title, description, actionLabel, actionTo }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>}
      <h2 className="mt-1 text-2xl font-bold text-gray-950">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>}
    </div>

    {actionLabel && actionTo && (
      <Link to={actionTo} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
        {actionLabel} →
      </Link>
    )}
  </div>
)

export default HomeSectionHeader

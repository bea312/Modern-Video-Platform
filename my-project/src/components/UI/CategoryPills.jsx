import categories from '../../constants/categories'

export default function CategoryPills({ activeCategory, onChange }) {
  return (
    <div className="pills-bar">
      <div className="pills-scroll">
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            className={`pill${activeCategory === name ? ' active' : ''}`}
            onClick={() => onChange(name)}
            aria-pressed={activeCategory === name}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

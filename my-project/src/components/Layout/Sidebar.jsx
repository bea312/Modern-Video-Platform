import categories from '../../constants/categories';

const Sidebar = ({ selectedCategory, onSelect }) => (
  <aside className="sidebar">
    {categories.map((category) => (
      <button
        key={category.name}
        className={`sidebar-item ${selectedCategory === category.name ? 'active' : ''}`}
        type="button"
        onClick={() => onSelect(category.name)}
      >
        {category.symbol && <span className="sidebar-icon">{category.symbol}</span>}
        <span>{category.name}</span>
      </button>
    ))}
  </aside>
);

export default Sidebar;

import categories from '../../constants/categories';

const CategoryPills = ({ activeCategory, onChange }) => (
  <div className="category-pills">
    {categories.map((category) => (
      <button
        type="button"
        key={category.name}
        className={`pill ${activeCategory === category.name ? 'active' : ''}`}
        onClick={() => onChange(category.name)}
      >
        {category.name}
      </button>
    ))}
  </div>
);

export default CategoryPills;

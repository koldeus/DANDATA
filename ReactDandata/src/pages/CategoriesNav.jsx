import React from 'react';
import './CategoriesNav.css';

const CategoryNav = ({ categories, theme, activeCategory, onCategoryChange }) => {
    console.log("Rendering CategoryNav with categories:", categories);
  return (
    <nav className={`category-nav ${theme}_subbtle-background`}>
      <div className="category-nav-container">
        {/* Option "Tous" par défaut */}
        <button 
          className={`category-nav-item ${!activeCategory ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          Tous
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}  
            className={`category-nav-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.Nom}
          </button>
        ))}
      </div>        

    </nav>
  );
};

export default CategoryNav;
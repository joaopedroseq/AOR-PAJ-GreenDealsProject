import { useState } from 'react';

const UserSearchBar = ({ allUsers, onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('username');
  const [sortField, setSortField] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSearch = () => {
    const filtered = allUsers.filter(user => {
      const fieldValue = user[searchField]?.toString().toLowerCase() || '';
      return fieldValue.includes(searchTerm.toLowerCase());
    });
    
    const sorted = [...filtered].sort((a, b) => {
      const valA = a.username.toLowerCase();
      const valB = b.username.toLowerCase();
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    onSearch(sorted);
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="search-dropdown"
        >
          <option value="username">Username</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
        </select>
        
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="sort-dropdown"
        >
          <option value="username">Sort by Username</option>
          <option value="products">Sort by Products</option>
        </select>
        
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-dropdown"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        
        <button 
          onClick={handleSearch}
          className="search-button"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default UserSearchBar;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    is_available: true,
    image_url: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch menu items from the backend
  useEffect(() => {
    axios.get('/api/menu-items')
      .then(response => setMenuItems(response.data))
      .catch(error => console.error('Error fetching menu items:', error));
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle adding/updating menu item
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      // Update item
      axios.put(`/api/menu-items/${editId}`, formData)
        .then(response => {
          setMenuItems(menuItems.map(item => item.item_id === editId ? response.data : item));
          setEditMode(false);
          setEditId(null);
        })
        .catch(error => console.error('Error updating menu item:', error));
    } else {
      // Add new item
      axios.post('/api/menu-items', formData)
        .then(response => {
          setMenuItems([...menuItems, response.data]);
        })
        .catch(error => console.error('Error adding menu item:', error));
    }
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      is_available: true,
      image_url: '',
    });
  };

  // Handle editing an item
  const handleEdit = (item) => {
    setFormData(item);
    setEditMode(true);
    setEditId(item.item_id);
  };

  // Handle deleting an item
  const handleDelete = (itemId) => {
    axios.delete(`/api/menu-items/${itemId}`)
      .then(() => {
        setMenuItems(menuItems.filter(item => item.item_id !== itemId));
      })
      .catch(error => console.error('Error deleting menu item:', error));
  };

  return (
    <div className="admin-menu">
      <h1>Manage Menu Items</h1>
      <form onSubmit={handleSubmit} className="menu-form">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
        />
        <input
          type="url"
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleInputChange}
        />
        <label>
          Available
          <input
            type="checkbox"
            name="is_available"
            checked={formData.is_available}
            onChange={(e) => setFormData(prevState => ({
              ...prevState,
              is_available: e.target.checked
            }))}
          />
        </label>
        <button type="submit">{editMode ? 'Update Item' : 'Add Item'}</button>
      </form>

      <div className="menu-list">
        <h2>Menu Items</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.item_id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td><img src={item.image_url} alt={item.name} width="50" /></td>
                <td>{item.is_available ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.item_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMenu;

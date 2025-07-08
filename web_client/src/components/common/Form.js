import React, { useState } from 'react';

function Form({ fields, initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.label}</label>
          {field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required={field.required}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              rows={field.rows || 4}
              className="w-full border rounded px-3 py-2"
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required={field.required}
            />
          )}
        </div>
      ))}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => onSubmit(null)}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}

export default Form;
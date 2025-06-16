import React, { useState } from 'react';
import Form from '../common/Form';

function Settings() {
  const [settings, setSettings] = useState({
    websiteName: 'XENH',
    contactEmail: 'admin@example.com',
    phone: '+84 123 456 789',
    description: 'Trang quản trị dành cho admin',
  });

  const formFields = [
    { label: 'Tên website', name: 'websiteName', type: 'text' },
    { label: 'Email liên hệ', name: 'contactEmail', type: 'email' },
    { label: 'Số điện thoại', name: 'phone', type: 'tel' },
    { label: 'Mô tả website', name: 'description', type: 'textarea', rows: 4 },
  ];

  const handleSubmit = (data) => {
    setSettings(data);
    alert('Cài đặt đã được lưu!');
  };

  return (
    <div className="bg-gradient-to-br from-f3e7f9 to-fce7f3 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Cài đặt hệ thống</h2>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">Cấu hình chung</h3>
        <Form fields={formFields} initialData={settings} onSubmit={handleSubmit} />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mt-4"
          onClick={() => handleSubmit(settings)}
        >
          <i className="fas fa-save mr-2"></i>
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
}

export default Settings;
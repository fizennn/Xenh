import React from 'react';

function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border text-base">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header} className="px-6 py-4 border text-left text-base">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t">
              {columns.map((column) => (
                <td key={column.header} className="px-6 py-4 text-base">
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
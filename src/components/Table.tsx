
"use client";

import React from "react";

interface Cell {
  text: string;
  link?: boolean;
}

type TableDataRow = Record<string, string | Cell>;

interface TableProps {
  columns: string[];
  data: TableDataRow[];
  /** when true, blur only the header row */
  loading?: boolean;
}

export default function Table({ columns, data, loading = false }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 mt-2" >
        <thead
          className={`${
            loading ? "filter blur-sm" : ""
          } bg-blue-50 dark:bg-gray-700 transition-[filter] duration-200`}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200"
              >
                {col.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 dark:border-gray-600"
            >
              {columns.map((col) => {
                const cell = row[col];
                if (typeof cell === "object") {
                  return (
                    <td
                      key={col}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {cell.link ? (
                        <a href={cell.text}>{cell.text}</a>
                      ) : (
                        cell.text
                      )}
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={col}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {cell}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

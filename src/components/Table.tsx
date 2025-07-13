import React from "react";

export default function Table({
  columns,
  data,
}: {
  columns: string[];
  data: Array<Record<string, string | { text: string; link: boolean }>>;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm mt-2">
          <thead className="bg-blue-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left font-medium text-gray-700 dark:text-white uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map((col) => {
                  const cell = row[col];
                  if (typeof cell === "object" && cell.link) {
                    return (
                      <td
                        key={col}
                        className="px-4 py-2 whitespace-nowrap text-blue-600 dark:text-blue-300 hover:underline"
                      >
                        {cell.text}
                      </td>
                    );
                  }
                  return (
                    <td
                      key={col}
                      className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-slate-300"
                    >
                      {typeof cell === "string" ? cell : cell?.text || ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="px-4 py-2 flex justify-end items-center text-xs text-gray-500 dark:text-gray-300 space-x-2" />
    </div>
  );
}

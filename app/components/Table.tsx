import { ReactNode } from 'react';
import LoadingAnimation from './LoadingAnimation';

export default function Table({
  rowItems,
  headerItems,
  rowsWidth,
  rowsHeight,
}: {
  rowItems: ReactNode[][];
  headerItems: ReactNode[];
  rowsWidth: (number | string)[];
  rowsHeight: number | string;
}) {
  return (
    <table className="flex flex-col border w-full rounded-2xl overflow-hidden">
      <thead>
        <tr className="flex bg-gray-200/50">
          {headerItems.map((item, index) => {
            return (
              <th key={index} className={`w-${rowsWidth[index]}`}>
                {item}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rowItems.length ? (
          rowItems.map((item, index) => (
            <tr
              className={`${index % 2 != 0 && 'bg-gray-200/25'} flex h-${rowsHeight}`}
              key={index}
            >
              {item.map((colItem, colIndex) => {
                return (
                  <td
                    key={colIndex + 'col'}
                    className={`flex items-center justify-center overflow-hidden h-full w-${rowsWidth[colIndex]}`}
                  >
                    {colItem}
                  </td>
                );
              })}
            </tr>
          ))
        ) : (
          <div className="flex flex-col items-center">
            <h6>در حال بارگذاری ...</h6>
            <LoadingAnimation />
          </div>
        )}
      </tbody>
    </table>
  );
}

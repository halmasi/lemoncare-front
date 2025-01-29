import { ReactNode } from 'react';

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
      <tr className="flex bg-gray-200/50">
        {headerItems.map((item, index) => {
          return <th className={`border w-${rowsWidth[index]}`}>{item}</th>;
        })}
      </tr>
      {rowItems.map((item, index) => (
        <tr
          className={`${index % 2 != 0 && 'bg-gray-200/50'} flex h-${rowsHeight} border`}
          key={index}
        >
          {item.map((colItem, colIndex) => {
            return (
              <td
                key={colIndex + 'col'}
                className={`flex items-center justify-center overflow-hidden border-x h-full w-${rowsWidth[colIndex]}`}
              >
                {colItem}
              </td>
            );
          })}
        </tr>
      ))}
    </table>
  );
}

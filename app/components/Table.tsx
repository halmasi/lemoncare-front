import { ReactNode } from 'react';
import LoadingAnimation from './LoadingAnimation';

export default function Table({
  rowItems,
  headerItems,
  rowsWidth,
  rowsHeight,
  highlightColorChange,
  normalColorChange,
}: {
  rowItems: ReactNode[][];
  headerItems: ReactNode[];
  rowsWidth: (number | string)[];
  rowsHeight: (number | string) | (number | string)[];
  highlightColorChange?: number;
  normalColorChange?: number;
}) {
  let counter = 0;

  let colorSwitch = true;
  let colorSwitchCounter = 0;
  const highlite = highlightColorChange || 1;
  const color = normalColorChange || 1;
  const colorCounter = () => {
    if (colorSwitch && colorSwitchCounter >= color) {
      colorSwitchCounter = 0;
      colorSwitch = !colorSwitch;
    }
    if (!colorSwitch && colorSwitchCounter >= highlite) {
      colorSwitchCounter = 0;
      colorSwitch = !colorSwitch;
    }
    colorSwitchCounter++;
    if (colorSwitch) return 'bg-white';
    return 'bg-gray-200/25';
  };

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
              className={`${colorCounter()} flex items-center h-${
                typeof rowsHeight == 'string' || typeof rowsHeight == 'number'
                  ? rowsHeight
                  : () => {
                      const res = rowsHeight[counter];
                      if (rowsHeight.length - 1 == counter) counter = 0;
                      else counter++;
                      return res;
                    }
              }`}
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
          <tr className="flex flex-col items-center">
            <td>
              <h6>در حال بارگذاری ...</h6>
              <LoadingAnimation />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

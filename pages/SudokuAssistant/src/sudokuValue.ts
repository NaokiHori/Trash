export const EMPTY_VALUE = 0;

export const SUDOKU_VALUES = [EMPTY_VALUE, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export type SudokuValue = (typeof SUDOKU_VALUES)[number];

export function isSudokuValue(value: number): value is SudokuValue {
  return (SUDOKU_VALUES as readonly number[]).includes(value);
}

export function isEmpty(value: SudokuValue): boolean {
  return EMPTY_VALUE === value;
}

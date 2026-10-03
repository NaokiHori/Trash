import { describe, expect, test, vi } from "vitest";
import { validateAndUpdateValue } from "./board";
import { EMPTY_VALUE, SUDOKU_VALUES } from "./sudokuValue";
import { ICell } from "./board/cell";

function createMockCell(): ICell {
  return {
    getIsDefault: vi.fn(() => false),
    setIsDefault: vi.fn(() => {
      // no op
    }),
    getValue: vi.fn(() => SUDOKU_VALUES[0]),
    setValue: vi.fn(() => {
      // no op
    }),
    setCellMode: vi.fn(() => {
      // no op
    }),
    validate: vi.fn(() => true),
    resetDisabledMemoValues: vi.fn(() => {
      // no op
    }),
    getSubCellDisability: vi.fn(() => false),
    setSubCellDisability: vi.fn(() => {
      // no op
    }),
    setSubCellValidity: vi.fn(() => {
      // no op
    }),
    validateAndUpdateMemoValues: vi.fn(() => {
      // no op
    }),
    updateUniquenessOfMemoValues: vi.fn(() => {
      // no op
    }),
    getIsSelected: vi.fn(() => true),
    setIsSelected: vi.fn(() => {
      // no op
    }),
    getPosition: vi.fn(() => {
      return { row: 0, column: 0 };
    }),
    neighborCells: { sameRow: [], sameColumn: [], sameBlock: [] },
  };
}

describe("validateAndUpdateValue (without value update)", () => {
  test("return early when no cell is selected", () => {
    const cell = createMockCell();
    cell.getIsSelected = vi.fn(() => false);
    validateAndUpdateValue("Init", EMPTY_VALUE, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.resetDisabledMemoValues).not.toHaveBeenCalled();
    expect(cell.setCellMode).not.toHaveBeenCalled();
    expect(cell.setIsDefault).not.toHaveBeenCalled();
    expect(cell.setSubCellDisability).not.toHaveBeenCalled();
    expect(cell.setSubCellValidity).not.toHaveBeenCalled();
    expect(cell.setValue).not.toHaveBeenCalled();
  });

  test("reject updates on default cells when not in 'Init' mode", () => {
    const cell = createMockCell();
    cell.getIsDefault = vi.fn(() => true);
    validateAndUpdateValue("Normal", 1, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.resetDisabledMemoValues).not.toHaveBeenCalled();
    expect(cell.setCellMode).not.toHaveBeenCalled();
    expect(cell.setIsDefault).not.toHaveBeenCalled();
    expect(cell.setSubCellDisability).not.toHaveBeenCalled();
    expect(cell.setSubCellValidity).not.toHaveBeenCalled();
    expect(cell.setValue).not.toHaveBeenCalled();
  });

  test("reject updates with non-empty invalid value when not in 'Init' mode", () => {
    const cell = createMockCell();
    cell.validate = vi.fn(() => false);
    validateAndUpdateValue("Normal", 1, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.resetDisabledMemoValues).not.toHaveBeenCalled();
    expect(cell.setCellMode).not.toHaveBeenCalled();
    expect(cell.setIsDefault).not.toHaveBeenCalled();
    expect(cell.setSubCellDisability).not.toHaveBeenCalled();
    expect(cell.setSubCellValidity).not.toHaveBeenCalled();
    expect(cell.setValue).not.toHaveBeenCalled();
  });
});

describe("validateAndUpdateValue (with value update, Init mode)", () => {
  const MODE = "Init";

  test("allow updates with empty value", () => {
    const cell = createMockCell();
    validateAndUpdateValue(MODE, EMPTY_VALUE, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.setCellMode).toHaveBeenCalledWith("Memo");
    expect(cell.setIsDefault).toHaveBeenCalledWith(false);
    expect(cell.setSubCellDisability).toHaveBeenCalledTimes(SUDOKU_VALUES.length);
    for (const sudokuValue of SUDOKU_VALUES) {
      expect(cell.setSubCellDisability).toHaveBeenCalledWith(sudokuValue, false);
    }
    expect(cell.setValue).toHaveBeenCalledWith(EMPTY_VALUE);
  });

  test("allow updates with non-empty value", () => {
    const cell = createMockCell();
    validateAndUpdateValue(MODE, 1, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.setCellMode).toHaveBeenCalledWith("Normal");
    expect(cell.setIsDefault).toHaveBeenCalledWith(true);
    expect(cell.setSubCellDisability).toHaveBeenCalledTimes(SUDOKU_VALUES.length);
    for (const sudokuValue of SUDOKU_VALUES) {
      expect(cell.setSubCellDisability).toHaveBeenCalledWith(sudokuValue, false);
    }
    expect(cell.setValue).toHaveBeenCalledWith(1);
  });
});

describe("validateAndUpdateValue (with value update, Normal mode)", () => {
  const MODE = "Normal";

  test("allow updates with empty value", () => {
    const cell = createMockCell();
    validateAndUpdateValue(MODE, EMPTY_VALUE, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.setCellMode).toHaveBeenCalledWith("Memo");
    expect(cell.setIsDefault).toHaveBeenCalledWith(false);
    expect(cell.setSubCellDisability).not.toHaveBeenCalled();
    expect(cell.setValue).toHaveBeenCalledWith(EMPTY_VALUE);
  });

  test("allow updates with non-empty value", () => {
    const cell = createMockCell();
    validateAndUpdateValue(MODE, 1, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.setCellMode).toHaveBeenCalledWith("Normal");
    expect(cell.setIsDefault).toHaveBeenCalledWith(false);
    expect(cell.setSubCellDisability).not.toHaveBeenCalled();
    expect(cell.setValue).toHaveBeenCalledWith(1);
  });
});

describe("validateAndUpdateValue (with value update, Memo mode)", () => {
  const MODE = "Memo";

  test("allow updates with empty value", () => {
    const cell = createMockCell();
    validateAndUpdateValue(MODE, EMPTY_VALUE, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.resetDisabledMemoValues).toHaveBeenCalledWith();
    expect(cell.setValue).toHaveBeenCalledWith(EMPTY_VALUE);
  });

  test("allow updates with non-empty and enabled value", () => {
    const cell = createMockCell();
    cell.getSubCellDisability = vi.fn(() => false);
    validateAndUpdateValue(MODE, 1, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.resetDisabledMemoValues).not.toHaveBeenCalled();
    expect(cell.setSubCellDisability).toHaveBeenCalledWith(1, true);
    expect(cell.setValue).toHaveBeenCalledWith(EMPTY_VALUE);
  });

  test("allow updates with non-empty and disabled value", () => {
    const cell = createMockCell();
    cell.getSubCellDisability = vi.fn(() => true);
    validateAndUpdateValue(MODE, 1, [cell]);
    // oxlint-disable typescript/unbound-method
    expect(cell.resetDisabledMemoValues).not.toHaveBeenCalled();
    expect(cell.setSubCellDisability).toHaveBeenCalledWith(1, false);
    expect(cell.setValue).toHaveBeenCalledWith(EMPTY_VALUE);
  });
});

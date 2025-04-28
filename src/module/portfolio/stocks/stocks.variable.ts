'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'stocks_holder',
      'stocks_name',
      'broker',
      'account_number',
      'userid',
      'stock_name',
      'currency',
      'purchase_value',
      'current_value',
      'lot',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

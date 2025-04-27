'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'forex_holder',
      'forex_name',
      'broker',
      'account_number',
      'userid',
      'currency',
      'purchase_value',
      'current_value',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

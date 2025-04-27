'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'collectibles_holder',
      'collectibles_name',
      'type',
      'description',
      'pruchase_date',
      'location',
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

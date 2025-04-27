'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'precious_metal_holder',
      'precious_metal_name',
      'type',
      'amount',
      'unit',
      'currency',
      'current_value',
      'purchase_value',
      'doc_location',
      'location',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

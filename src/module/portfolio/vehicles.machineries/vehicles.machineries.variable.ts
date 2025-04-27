'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'vehicles_machineries_holder',
      'vehicles_machineries_name',
      'brand',
      'type',
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

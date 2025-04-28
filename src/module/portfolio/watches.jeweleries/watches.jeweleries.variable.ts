'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'watches_jeweleries_holder',
      'watches_jeweleries_name',
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

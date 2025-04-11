'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'properties_holder',
      'properties_name',
      'type',
      'address',
      'land_area',
      'building_area',
      'currency',
      'purchase_value',
      'doc_location',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

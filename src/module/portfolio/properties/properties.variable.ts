'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'properties_holder',
      'properties_name',
      'type',
      'ownership',
      'certificate_number',
      'address',
      'land_area',
      'building_area',
      'currency',
      'current_value',
      'purchase_date',
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

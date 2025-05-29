'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'digital_assets_holder',
      'digital_assets_name',
      'type',
      'selling_agent',
      'serial_number',
      'account_number',
      'userid',
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

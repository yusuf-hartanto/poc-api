'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'intellectual_properties_holder',
      'intellectual_properties_name',
      'type',
      'creation_date',
      'appraised_value',
      'appraised_name',
      'contract_number',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

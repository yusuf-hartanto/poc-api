'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'shares_business_holder',
      'shares_business_name',
      'class',
      'type',
      'acquisition_date',
      'no_of_shares',
      'percentage',
      'entity_name',
      'contact_number',
      'doc_location',
      'location',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

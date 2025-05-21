'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'bonds_holder',
      'bonds_name',
      'type',
      'broker',
      'product_number',
      'issuer_name',
      'issuer_date',
      'maturity_date',
      'currency',
      'amount',
      'interest_rate',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'cash_holder',
      'cash_name',
      'type',
      'product_number',
      'bank_name',
      'start_date',
      'maturity_date',
      'currency',
      'amount',
      'payor',
      'payee',
      'aro',
      'location',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

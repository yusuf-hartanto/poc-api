'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'crypto_assets_holder',
      'crypto_assets_name',
      'broker',
      'account_number',
      'userid',
      'coin_name',
      'coin_amount',
      'currency',
      'purchase_value',
      'current_value',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

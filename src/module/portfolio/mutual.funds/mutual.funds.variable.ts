'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'mutual_funds_holder',
      'mutual_funds_name',
      'type',
      'fund_manager',
      'purchase_date',
      'purchase_value',
      'maturity_date',
      'currency',
      'current_value',
      'selling_agent',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

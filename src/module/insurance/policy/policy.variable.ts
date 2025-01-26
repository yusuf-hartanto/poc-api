'use strict';

export default class Variable {
  public policy() {
    const field: Array<string> = [
      'policy_number',
      'provider_company',
      'product_name',
      'policy_holder',
      'insured_holder',
      'beneficiary_holder',
      'issued_date',
      'premi_currency',
      'premi_value',
      'premi_off',
      'payment_term',
      'payment_term_unit',
      'insured_term',
      'insured_term_unit',
      'due_date',
      'seller_name',
      'notes',
      'status',
    ];
    return field;
  }

  public detail() {
    const field: Array<string> = [
      'policy_id',
      'unit_link',
      'fund',
      'cash_value',
      'benefit',
      'start_date',
      'end_date',
    ];
    return field;
  }
}

export const variable = new Variable();

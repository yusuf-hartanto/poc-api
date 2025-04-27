'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'receivables_holder',
      'receivables_name',
      'debtor_name',
      'goods',
      'contract_number',
      'contract_date',
      'currency',
      'total_receivable_amount',
      'due_date',
      'doc_location',
      'location',
      'notes',
      'status',
    ];
    return field;
  }
}

export const variable = new Variable();

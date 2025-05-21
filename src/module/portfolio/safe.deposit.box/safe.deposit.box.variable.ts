'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'name',
      'location',
      'address',
      'status',
      'sdb_holder',
      'flag_sdb',
    ];
    return field;
  }
}

export const variable = new Variable();

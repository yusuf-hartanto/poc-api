'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = [
      'cin',
      'name',
      'ktp',
      'dob',
      'age',
      'email',
      'contact_number',
      'address',
      'relation_id',
      'relation_name',
      'relation_name',
      'flag_client',
      'agent_id',
    ];
    return field;
  }
}

export const variable = new Variable();

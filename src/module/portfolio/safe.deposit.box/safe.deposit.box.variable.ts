'use strict';

export default class Variable {
  public fillable() {
    const field: Array<string> = ['name', 'location', 'address', 'status'];
    return field;
  }
}

export const variable = new Variable();

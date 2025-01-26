'use strict';

import Model from './currency.model';

export default class Respository {
  public detail(condition: any) {
    return Model.findOne({
      where: condition,
    });
  }

  public create(data: any) {
    return Model.create(data?.payload);
  }

  public update(data: any) {
    return Model.update(data?.payload, {
      where: data?.condition,
    });
  }
}
export const repository = new Respository();

'use strict';

import Model from './upload.model';

export default class Repository {
  public detail(condition: any) {
    return Model.findOne({
      where: condition,
    });
  }

  public create(payload: any) {
    return Model.create(payload);
  }

  public update(data: any) {
    return Model.update(data?.payload, {
      where: data?.condition,
    });
  }
}

export const repository = new Repository();

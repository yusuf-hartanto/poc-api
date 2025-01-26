'use strict';

import { Op } from 'sequelize';
import Form from './form.model';
import Event from './event.model';
import FormAnswer from './form.answer.model';
import FormAnswerValue from './form.answer.value.model';

export default class Respository {
  public list() {
    return Event.findAll({
      where: {
        is_active: { [Op.ne]: 9 },
      },
      order: [['created_date', 'DESC']],
    });
  }

  public index(data: any) {
    let query: Object = {
      order: [['created_date', 'DESC']],
      offset: data?.offset,
      limit: data?.limit,
    };
    if (data?.keyword && data?.keyword != undefined) {
      query = {
        ...query,
        where: {
          is_active: { [Op.ne]: 9 },
          [Op.or]: [
            { event: { [Op.like]: `%${data?.keyword}%` } },
            { desc: { [Op.like]: `%${data?.keyword}%` } },
          ],
        },
      };
    }
    return Event.findAndCountAll(query);
  }

  public detail(condition: any) {
    return Event.findOne({
      where: {
        ...condition,
        is_active: { [Op.ne]: 9 },
      },
    });
  }

  public create(data: any) {
    return Event.create(data?.payload);
  }

  public createForm(data: any) {
    return Form.create(data?.payload);
  }

  public createFormAnswer(data: any) {
    return FormAnswer.create(data?.payload);
  }

  public createFormAnswerValue(data: any) {
    return FormAnswerValue.create(data?.payload);
  }

  public update(data: any) {
    return Event.update(data?.payload, {
      where: data?.condition,
    });
  }

  public updateForm(data: any) {
    return Form.update(data?.payload, {
      where: data?.condition,
    });
  }

  public updateFormAnswer(data: any) {
    return FormAnswer.update(data?.payload, {
      where: data?.condition,
    });
  }

  public updateFormAnswerValue(data: any) {
    return FormAnswerValue.update(data?.payload, {
      where: data?.condition,
    });
  }

  public delete(data: any) {
    return Event.destroy({
      where: data?.condition,
    });
  }

  public deleteForm(data: any) {
    return Form.destroy({
      where: data?.condition,
    });
  }

  public deleteFormAnswer(data: any) {
    return FormAnswer.destroy({
      where: data?.condition,
    });
  }

  public deleteFormAnswerValue(data: any) {
    return FormAnswerValue.destroy({
      where: data?.condition,
    });
  }

  public findForm(condition: any) {
    return Form.findAll({
      where: {
        ...condition,
        is_active: { [Op.ne]: 9 },
      },
      order: [['nourut', 'ASC']],
    });
  }

  public detailForm(condition: any) {
    return Form.findOne({
      where: {
        ...condition,
        is_active: { [Op.ne]: 9 },
      },
    });
  }

  public findFormAnswer(condition: any) {
    return FormAnswer.findAll({
      where: condition,
      order: [['nourut', 'ASC']],
    });
  }

  public detailFormAnswer(condition: any) {
    return FormAnswer.findOne({
      where: condition,
    });
  }

  public findFormAnswerValue(condition: any) {
    return FormAnswerValue.findAll({
      where: condition,
      order: [['created_date', 'DESC']],
      include: [
        {
          model: Event,
          as: 'event',
          required: false,
        },
        {
          model: Form,
          as: 'form',
          required: false,
        },
      ],
    });
  }

  public detailFormAnswerValue(condition: any) {
    return FormAnswerValue.findOne({
      where: condition,
      include: [
        {
          model: Event,
          as: 'event',
          required: false,
        },
        {
          model: Form,
          as: 'form',
          required: false,
        },
      ],
    });
  }
}

export const repository = new Respository();

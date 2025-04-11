'use strict';

import moment from 'moment';
import { variable } from './survey.variable';
import { Request, Response } from 'express';
import { helper } from '../../helpers/helper';
import { repository } from './survey.repository';
import { response } from '../../helpers/response';
import { transformer } from './survey.transformer';
import { repository as repoClient } from '../insurance/client/client.repository';

const date: string = helper.date();

export default class Controller {
  public async index(req: Request, res: Response) {
    try {
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;
      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
      });
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      const event = await transformer.list(rows);
      return response.success(
        'Data event',
        { total: count, values: event },
        res
      );
    } catch (err: any) {
      return helper.catchError(`event index: ${err?.message}`, 500, res);
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({ id });
      if (!result) return response.failed('Data not found', 404, res);
      const event = await transformer.detail(result);
      return response.success('Data event', event, res);
    } catch (err: any) {
      return helper.catchError(`event detail: ${err?.message}`, 500, res);
    }
  }

  public async clientSurvey(req: Request, res: Response) {
    try {
      let id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      if (
        !['administrator', 'agent'].includes(req?.user?.role_name) &&
        req?.user?.client_id != id
      )
        return response.failed('Data not found', 404, res);

      const result: Object | any = await repoClient.detailSurvey({ id });
      if (!result) return response.failed('Data not found', 404, res);
      const client = await transformer.detailClient(result);
      return response.success('Data client', client, res);
    } catch (err: any) {
      return helper.catchError(`client detail: ${err?.message}`, 500, res);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const check = await repository.detail({
        event: req?.body?.event,
      });
      if (check) return response.failed('Event already exists', 400, res);
      const data: Object = helper.only(variable.event(), req?.body);
      await repository.create({
        payload: { ...data, created_by: req?.user?.id },
      });

      const { form, form_id } = req?.body;
      if (form?.length > 0) {
        for (let i in form) {
          const dataForm: Object = helper.only(variable.form(), form[i]);
          const f = await repository.createForm({
            payload: {
              ...dataForm,
              form_id: form_id || '00000000-0000-0000-0000-000000000000',
              parent_id:
                form[i]?.parent_id || '00000000-0000-0000-0000-000000000000',
              created_by: req?.user?.id,
            },
          });

          let answers = form[i]?.answer;
          if (answers?.length > 0) {
            for (let x in answers) {
              const dataFormAnswer: Object = helper.only(
                variable.formanswer(),
                answers[x]
              );
              await repository.createFormAnswer({
                payload: {
                  ...dataFormAnswer,
                  question_id:
                    f?.dataValues?.question_id ||
                    '00000000-0000-0000-0000-000000000000',
                  created_by: req?.user?.id,
                },
              });
            }
          }
        }
      }

      return response.success('Data success saved', null, res);
    } catch (err: any) {
      return helper.catchError(`event create: ${err?.message}`, 500, res);
    }
  }

  public async createAnswer(req: Request, res: Response) {
    try {
      const { client_id, event_id, form_id, answer } = req?.body;
      if (answer && answer?.length > 0) {
        for (let i in answer) {
          let condition = {
            client_id,
            event_id,
            form_id,
            question_id: answer[i]?.question_id,
            periode: moment().locale('id').format('YYYY-MM-DD'),
          };

          const check = await repository.detailFormAnswerValue(condition);

          if (check) {
            const data: Object = helper.only(
              variable.formanswervalue(),
              req?.body,
              true
            );
            await repository.updateFormAnswerValue({
              payload: {
                ...data,
                question_id: answer[i]?.question_id,
                question: answer[i]?.question,
                text_answer: answer[i]?.text_answer,
                modified_by: req?.user?.id,
              },
              condition: condition,
            });
          } else {
            const data: Object = helper.only(
              variable.formanswervalue(),
              req?.body
            );
            await repository.createFormAnswerValue({
              payload: {
                ...data,
                question_id: answer[i]?.question_id,
                question: answer[i]?.question,
                text_answer: answer[i]?.text_answer,
                created_by: req?.user?.id,
              },
            });
          }
        }
      } else {
        return response.failed('answer is a required', 422, res);
      }

      return response.success('Data success saved', null, res);
    } catch (err: any) {
      return helper.catchError(
        `event create answer: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ id });
      if (!check) return response.failed('Data not found', 404, res);

      const data: Object = helper.only(variable.event(), req?.body, true);
      await repository.update({
        payload: { ...data, modified_by: req?.user?.id },
        condition: { id },
      });

      const { form } = req?.body;
      if (form?.length > 0) {
        const form_id: string =
          req?.body?.form_id || check?.dataValues?.form_id;
        await repository.deleteForm({
          condition: { form_id },
        });
        for (let i in form) {
          const dataForm: Object = helper.only(variable.form(), form[i], true);
          const f = await repository.createForm({
            payload: {
              ...dataForm,
              form_id: form_id,
              parent_id:
                form[i]?.parent_id || '00000000-0000-0000-0000-000000000000',
              created_by: req?.user?.id,
            },
          });

          let answers = form[i]?.answer;
          if (answers?.length > 0) {
            if (form[i]?.question_id) {
              await repository.deleteFormAnswer({
                condition: { question_id: form[i]?.question_id },
              });
            }
            for (let x in answers) {
              const dataFormAnswer: Object = helper.only(
                variable.formanswer(),
                answers[x],
                true
              );
              await repository.createFormAnswer({
                payload: {
                  ...dataFormAnswer,
                  question_id:
                    f?.dataValues?.question_id ||
                    '00000000-0000-0000-0000-000000000000',
                  created_by: req?.user?.id,
                },
              });
            }
          }
        }
      }
      return response.success('Data success updated', null, res);
    } catch (err: any) {
      return helper.catchError(`event update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ id });
      if (!check) return response.failed('Data not found', 404, res);
      await repository.update({
        payload: {
          is_active: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { id },
      });
      return response.success('Data success deleted', null, res);
    } catch (err: any) {
      return helper.catchError(`event delete: ${err?.message}`, 500, res);
    }
  }
}

export const event = new Controller();

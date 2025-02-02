'use strict';

import { Op } from 'sequelize';
import { repository } from './survey.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      const forms = await repository.findForm({
        form_id: data[i]?.dataValues?.form_id,
      });

      let resForm: Array<object> = [];
      if (forms?.length > 0) {
        for (let n in forms) {
          const resAnswer = await repository.findFormAnswer({
            question_id: forms[n]?.dataValues?.question_id,
          });

          resForm.push({
            ...forms[n]?.dataValues,
            answer: resAnswer,
          });
        }
      }

      result.push({
        ...data[i]?.dataValues,
        form: resForm,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const forms = await repository.findForm({
      form_id: data?.dataValues?.form_id,
    });

    let resForm: Array<object> = [];
    if (forms?.length > 0) {
      for (let n in forms) {
        const resAnswer = await repository.findFormAnswer({
          question_id: forms[n]?.dataValues?.question_id,
        });

        resForm.push({
          ...forms[n]?.dataValues,
          answer: resAnswer,
        });
      }
    }

    return {
      ...data?.dataValues,
      form: resForm,
    };
  }

  public async detailClient(data: any) {
    const answerValues = await repository.findFormAnswerValue({
      client_id: data?.dataValues?.id,
    });

    let resSurvey: Array<object> = [];
    if (answerValues?.length > 0) {
      for (let n in answerValues) {
        const answer = await repository.detailFormAnswer({
          question_id: answerValues[n]?.dataValues?.question_id,
          text_answer: {
            [Op.like]: `%${answerValues[n]?.dataValues?.text_answer}%`,
          },
        });
        resSurvey.push({
          id: answerValues[n]?.dataValues?.event?.id,
          form_id: answerValues[n]?.dataValues?.event?.form_id,
          event: answerValues[n]?.dataValues?.event?.event,
          desc: answerValues[n]?.dataValues?.event?.desc,
          start_period: answerValues[n]?.dataValues?.event?.start_period,
          end_period: answerValues[n]?.dataValues?.event?.end_period,
          is_active: answerValues[n]?.dataValues?.event?.is_active,
          is_random: answerValues[n]?.dataValues?.event?.is_random,
          question: answerValues[n]?.dataValues?.form,
          answer: {
            id: answerValues[n]?.dataValues?.id,
            client_id: answerValues[n]?.dataValues?.client_id,
            event_id: answerValues[n]?.dataValues?.event_id,
            form_id: answerValues[n]?.dataValues?.form_id,
            question_id: answerValues[n]?.dataValues?.question_id,
            text_answer: answerValues[n]?.dataValues?.text_answer,
            alert_answer: answer?.dataValues?.alert_answer,
          },
        });
      }
    }

    return {
      ...data?.dataValues,
      survey: resSurvey,
    };
  }
}

export const transformer = new Transformer();

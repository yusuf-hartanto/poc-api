'use strict';

import { Op } from 'sequelize';
import { repository } from './survey.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (const i in data) {
      const forms = await repository.findForm({
        form_id: data[i]?.dataValues?.form_id,
      });

      let resForm: Array<object> = [];
      if (forms?.length > 0) {
        for (const n in forms) {
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
      for (const n in forms) {
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
    let resSurvey: Array<object> = [];

    const groupAnswerValueByClient = await repository.findAnswerValuePeriode({
      client_id: data?.dataValues?.id,
    });

    if (groupAnswerValueByClient?.length > 0) {
      for (const x in groupAnswerValueByClient) {
        const answerValues = await repository.findFormAnswerValue({
          client_id: data?.dataValues?.id,
          periode: groupAnswerValueByClient[x]?.dataValues?.periode,
        });

        let question: Array<object> = [];
        if (answerValues?.length > 0) {
          for (const n in answerValues) {
            const answer = await repository.detailFormAnswer({
              question_id: answerValues[n]?.dataValues?.question_id,
              text_answer: {
                [Op.like]: `%${answerValues[n]?.dataValues?.text_answer}%`,
              },
            });
            question.push({
              question_id: answerValues[n]?.dataValues?.form?.question_id,
              form_id: answerValues[n]?.dataValues?.form?.form_id,
              question: answerValues[n]?.dataValues?.form?.question,
              parent_id: answerValues[n]?.dataValues?.form?.parent_id,
              type: answerValues[n]?.dataValues?.form?.type,
              nourut: answerValues[n]?.dataValues?.form?.nourut,
              url_image1: answerValues[n]?.dataValues?.form?.url_image1,
              url_image2: answerValues[n]?.dataValues?.form?.url_image2,
              is_active: answerValues[n]?.dataValues?.is_active,
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

        resSurvey.push({
          id: groupAnswerValueByClient[x]?.dataValues?.event?.id,
          form_id: groupAnswerValueByClient[x]?.dataValues?.event?.form_id,
          event: groupAnswerValueByClient[x]?.dataValues?.event?.event,
          desc: groupAnswerValueByClient[x]?.dataValues?.event?.desc,
          start_period:
            groupAnswerValueByClient[x]?.dataValues?.event?.start_period,
          end_period:
            groupAnswerValueByClient[x]?.dataValues?.event?.end_period,
          is_active: groupAnswerValueByClient[x]?.dataValues?.event?.is_active,
          is_random: groupAnswerValueByClient[x]?.dataValues?.event?.is_random,
          periode: groupAnswerValueByClient[x]?.dataValues?.periode,
          question: question,
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

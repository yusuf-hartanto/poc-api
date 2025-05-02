'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class SurveyFormAnswerValue extends Model {
  public id!: string;
  public client_id!: string;
  public event_id!: string;
  public form_id!: string;
  public periode!: Date;
  public question_id!: string;
  public question!: string;
  public text_answer!: string;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initSurveyFormAnswerValue(sequelize: Sequelize) {
  SurveyFormAnswerValue.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      client_id: {
        type: DataTypes.STRING,
      },
      event_id: {
        type: DataTypes.STRING,
      },
      form_id: {
        type: DataTypes.STRING,
      },
      periode: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      question_id: {
        type: DataTypes.STRING,
      },
      question: {
        type: DataTypes.STRING,
      },
      text_answer: {
        type: DataTypes.STRING,
      },
      created_by: {
        type: DataTypes.STRING,
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      modified_by: {
        type: DataTypes.STRING,
      },
      modified_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'SurveyFormAnswerValue',
      tableName: 'survey_form_answer_value',
      timestamps: false,
    }
  );

  SurveyFormAnswerValue.beforeCreate((survey_form_answer_value) => {
    survey_form_answer_value?.setDataValue('id', uuidv4());
  });
  return SurveyFormAnswerValue;
}

export function associateSurveyFormAnswerValue() {}

export default SurveyFormAnswerValue;

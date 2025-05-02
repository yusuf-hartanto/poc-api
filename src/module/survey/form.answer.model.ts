'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class SurveyFormAnswer extends Model {
  public answer_id!: string;
  public question_id!: string;
  public text_answer!: string;
  public alert_answer!: string;
  public nourut!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initSurveyFormAnswer(sequelize: Sequelize) {
  SurveyFormAnswer.init(
    {
      answer_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      question_id: {
        type: DataTypes.STRING,
      },
      text_answer: {
        type: DataTypes.STRING,
      },
      alert_answer: {
        type: DataTypes.STRING,
      },
      nourut: {
        type: DataTypes.INTEGER,
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
      modelName: 'SurveyFormAnswer',
      tableName: 'survey_form_answer',
      timestamps: false,
    }
  );

  SurveyFormAnswer.beforeCreate((survey_form_answer) => {
    survey_form_answer?.setDataValue('answer_id', uuidv4());
  });
  return SurveyFormAnswer;
}

export function associateSurveyFormAnswer() {}

export default SurveyFormAnswer;

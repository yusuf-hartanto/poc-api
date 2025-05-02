'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class SurveyForm extends Model {
  public question_id!: string;
  public form_id!: string;
  public question!: string;
  public parent_id!: string;
  public type!: string;
  public nourut!: number;
  public url_image1!: string;
  public url_image2!: string;
  public is_active!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initSurveyForm(sequelize: Sequelize) {
  SurveyForm.init(
    {
      question_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      form_id: {
        type: DataTypes.STRING,
      },
      question: {
        type: DataTypes.STRING,
      },
      parent_id: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      nourut: {
        type: DataTypes.INTEGER,
      },
      url_image1: {
        type: DataTypes.STRING,
      },
      url_image2: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
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
      modelName: 'SurveyForm',
      tableName: 'survey_form',
      timestamps: false,
    }
  );

  SurveyForm.beforeCreate((survey_form) => {
    survey_form?.setDataValue('question_id', uuidv4());
  });
  return SurveyForm;
}

export function associateSurveyForm() {}

export default SurveyForm;

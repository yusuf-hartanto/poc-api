'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class SurveyEvent extends Model {
  public id!: string;
  public form_id!: string;
  public event!: string;
  public desc!: string;
  public start_period!: Date;
  public end_period!: Date;
  public is_active!: number;
  public is_random!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initSurveyEvent(sequelize: Sequelize) {
  SurveyEvent.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      form_id: {
        type: DataTypes.STRING,
      },
      event: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.STRING,
      },
      start_period: {
        type: DataTypes.DATE,
      },
      end_period: {
        type: DataTypes.DATE,
      },
      is_active: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      is_random: {
        type: DataTypes.TINYINT,
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
      modelName: 'SurveyEvent',
      tableName: 'survey_event',
      timestamps: false,
    }
  );

  SurveyEvent.beforeCreate((survey_event) => {
    survey_event?.setDataValue('id', uuidv4());
  });
  return SurveyEvent;
}

export function associateSurveyEvent() {}

export default SurveyEvent;

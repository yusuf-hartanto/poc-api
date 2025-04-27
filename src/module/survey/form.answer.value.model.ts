'use strict';

import Form from './form.model';
import Event from './event.model';
import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../config/database';

const Model = conn.sequelize.define(
  'survey_form_answer_value',
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
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

Model.beforeCreate(
  (survey_form_answer_value: { id: string }) =>
    (survey_form_answer_value.id = uuidv4())
);
Model.belongsTo(Event, { as: 'event', foreignKey: 'event_id' });
Model.belongsTo(Form, { as: 'form', foreignKey: 'question_id' });

export default Model;

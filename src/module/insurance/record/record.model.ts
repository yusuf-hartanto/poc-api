'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Policy from '../policy/policy.model';
import Client from '../client/client.model';

const Model = conn.sequelize.define(
  'insurance_record',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    policy_id: {
      type: DataTypes.STRING,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    notification_date: {
      type: DataTypes.STRING,
    },
    notification_type: {
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
  (insurance_record: { id: string }) => (insurance_record.id = uuidv4())
);
Model.belongsTo(Policy, { as: 'policy', foreignKey: 'policy_id' });
Model.belongsTo(Client, { as: 'client', foreignKey: 'client_id' });

export default Model;

'use strict';

import { v4 as uuidv4 } from 'uuid';
import { QueryInterface, Sequelize } from 'sequelize';
import Model from '../../module/app/role/role.model';

type Migration = (
  queryInterface: QueryInterface,
  sequelize: Sequelize
) => Promise<void>;
export const up: Migration = async () => {
  await Model.bulkCreate([
    {
      role_id: uuidv4(),
      role_name: 'administrator',
      status: 1,
      restrict_level_area: 0,
      created_by: '00000000-0000-0000-0000-000000000000',
    },
    {
      role_id: uuidv4(),
      role_name: 'agent',
      status: 1,
      restrict_level_area: 1,
      created_by: '00000000-0000-0000-0000-000000000000',
    },
    {
      role_id: uuidv4(),
      role_name: 'client',
      status: 1,
      restrict_level_area: 0,
      created_by: '00000000-0000-0000-0000-000000000000',
    },
  ]);
};

export const down: Migration = async () => {
  await Model.destroy({ where: {}, truncate: true });
};

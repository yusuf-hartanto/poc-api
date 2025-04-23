'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE app_otp (
      id int(11) NOT NULL AUTO_INCREMENT,
      email varchar(50) DEFAULT NULL,
      code int(11) unsigned DEFAULT NULL,
      \`status\` int(1) unsigned NOT NULL DEFAULT '0' COMMENT '0:unverified, 1:verified, 2:used, 3:expired',
      expired datetime DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (id),
      KEY app_otp_id_IDX (id) USING BTREE,
      KEY app_otp_email_IDX (email) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS app_otp;`);
};

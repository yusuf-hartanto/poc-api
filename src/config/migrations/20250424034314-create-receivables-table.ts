'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE receivables (
      receivables_id varchar(50) NOT NULL,
      receivables_holder varchar(50) DEFAULT NULL,
      receivables_name varchar(250) DEFAULT NULL,
      debtor_name varchar(250) DEFAULT NULL,
      goods varchar(250) DEFAULT NULL,
      contact_number varchar(250) DEFAULT NULL,
      contract_date date DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      total_receivable_amount decimal(12,2) DEFAULT NULL,
      due_date date DEFAULT NULL,
      location varchar(250) DEFAULT NULL,
      doc_location varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (receivables_id) USING BTREE,
      UNIQUE KEY unique_receivables_id (receivables_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS receivables;`);
};

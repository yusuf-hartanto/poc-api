'use strict';

import { Sequelize } from 'sequelize';
import { initAppOtp } from '../auth/otp.model';
import { initAppMenu } from '../app/menu/menu.model';
import { initSurveyForm } from '../survey/form.model';
import { initSurveyEvent } from '../survey/event.model';
import { initCurrency } from '../currency/currency.model';
import { initRecord } from '../insurance/record/record.model';
import { initClient } from '../insurance/client/client.model';
import { initSurveyFormAnswer } from '../survey/form.answer.model';
import { initPolicyDetail } from '../insurance/policy/policy.model';
import { initCash, associateCash } from '../portfolio/cash/cash.model';
import { initAppRole, associateAppRole } from '../app/role/role.model';
import { initForex, associateForex } from '../portfolio/forex/forex.model';
import { initBonds, associateBonds } from '../portfolio/bonds/bonds.model';
import { initSurveyFormAnswerValue } from '../survey/form.answer.value.model';
import { initStocks, associateStocks } from '../portfolio/stocks/stocks.model';
import { initAreaRegency, associateAreaRegency } from '../area/regencies.model';
import {
  initAreaProvince,
  associateAreaProvince,
} from '../area/provinces.model';
import {
  initPolicy,
  associatePolicy,
} from '../insurance/policy/policy.detail.model';
import {
  initAppRoleMenu,
  associateAppRoleMenu,
} from '../app/role.menu/role.menu.model';
import { initSafeDepositBox } from '../portfolio/safe.deposit.box/safe.deposit.box.model';
import {
  initAppResourceModel,
  associateAppResource,
} from '../app/resource/resource.model';
import {
  initProperties,
  associateProperties,
} from '../portfolio/properties/properties.model';
import {
  initReceivables,
  associateReceivables,
} from '../portfolio/receivables/receivables.model';
import {
  initMutualFunds,
  associateMutualFunds,
} from '../portfolio/mutual.funds/mutual.funds.model';
import {
  initCollectibles,
  associateCollectibles,
} from '../portfolio/collectibles/collectibles.model';
import {
  initCryptoAssets,
  associateCryptoAssets,
} from '../portfolio/crypto.assets/crypto.assets.model';
import {
  initPreciousMetal,
  associatePreciousMetal,
} from '../portfolio/precious.metal/precious.metal.model';
import {
  initSharesBusiness,
  associateSharesBusiness,
} from '../portfolio/shares.business/shares.business.model';
import {
  initWatchesJeweleries,
  associateWatchesJeweleries,
} from '../portfolio/watches.jeweleries/watches.jeweleries.model';
import {
  initVehiclesMachineries,
  associateVehiclesMachineries,
} from '../portfolio/vehicles.machineries/vehicles.machineries.model';
import {
  initIntellectualProperties,
  associateIntellectualProperties,
} from '../portfolio/intellectual.properties/intellectual.properties.model';

export function initializeModels(sequelize: Sequelize) {
  // initialize
  initCash(sequelize);
  initForex(sequelize);
  initBonds(sequelize);
  initStocks(sequelize);
  initRecord(sequelize);
  initPolicy(sequelize);
  initAppOtp(sequelize);
  initClient(sequelize);
  initAppRole(sequelize);
  initAppMenu(sequelize);
  initCurrency(sequelize);
  initProperties(sequelize);
  initSurveyForm(sequelize);
  initReceivables(sequelize);
  initMutualFunds(sequelize);
  initSurveyEvent(sequelize);
  initAppRoleMenu(sequelize);
  initAreaRegency(sequelize);
  initAreaProvince(sequelize);
  initPolicyDetail(sequelize);
  initCollectibles(sequelize);
  initCryptoAssets(sequelize);
  initPreciousMetal(sequelize);
  initSharesBusiness(sequelize);
  initSafeDepositBox(sequelize);
  initSurveyFormAnswer(sequelize);
  initAppResourceModel(sequelize);
  initWatchesJeweleries(sequelize);
  initVehiclesMachineries(sequelize);
  initSurveyFormAnswerValue(sequelize);
  initIntellectualProperties(sequelize);

  // associate
  associateCash();
  associateForex();
  associateBonds();
  associatePolicy();
  associateStocks();
  associateAppRole();
  associateProperties();
  associateReceivables();
  associateMutualFunds();
  associateAppRoleMenu();
  associateAppResource();
  associateAreaRegency();
  associateAreaProvince();
  associateCollectibles();
  associateCryptoAssets();
  associatePreciousMetal();
  associateSharesBusiness();
  associateWatchesJeweleries();
  associateVehiclesMachineries();
  associateIntellectualProperties();
}

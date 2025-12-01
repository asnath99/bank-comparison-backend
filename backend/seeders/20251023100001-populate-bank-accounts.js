'use strict';

const { Bank } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const banks = await Bank.findAll();
    const bankNameToId = banks.reduce((acc, bank) => {
      acc[bank.name] = bank.id;
      return acc;
    }, {});

    const bankAccounts = [
      // BOA
      { bank_id: bankNameToId['BOA (Banque of Africa)'], type: 'COMPTE INDIVIDUEL', monthly_fee: 4025, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['BOA (Banque of Africa)'], type: 'COMPTE SALARIE', monthly_fee: 4025, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['BOA (Banque of Africa)'], type: 'COMPTE ENTREPRISE', monthly_fee: 3000, currency: 'FCFA', notes: '<30M FCFA CA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['BOA (Banque of Africa)'], type: 'COMPTE ENTREPRISE', monthly_fee: 9000, currency: 'FCFA', notes: '> 30M FCFA CA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },

      // BSIC
      { bank_id: bankNameToId['BSIC (Banque Sahélo-Saharienne)'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1180, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['BSIC (Banque Sahélo-Saharienne)'], type: 'COMPTE SALARIE', monthly_fee: 1180, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['BSIC (Banque Sahélo-Saharienne)'], type: 'COMPTE ENTREPRISE', monthly_fee: 5900, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // Ecobank
      { bank_id: bankNameToId['Ecobank Burkina Faso'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1500, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Ecobank Burkina Faso'], type: 'COMPTE SALARIE', monthly_fee: 1500, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Ecobank Burkina Faso'], type: 'COMPTE ENTREPRISE', monthly_fee: 6000, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },

      // BADF
      { bank_id: bankNameToId['BADF Burkina Faso'], type: 'COMPTE INDIVIDUEL', monthly_fee: 5000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['BADF Burkina Faso'], type: 'COMPTE ENTREPRISE', monthly_fee: 5000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // WBI
      { bank_id: bankNameToId['WBI (Wendkuni Bank International)'], type: 'COMPTE INDIVIDUEL', monthly_fee: 2500, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['WBI (Wendkuni Bank International)'], type: 'COMPTE ENTREPRISE', monthly_fee: 5750, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // Vista Bank
      { bank_id: bankNameToId['Vista Bank Burkina Faso'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1500, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Vista Bank Burkina Faso'], type: 'COMPTE SALARIE', monthly_fee: 1500, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Vista Bank Burkina Faso'], type: 'COMPTE ENTREPRISE', monthly_fee: 6000, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },

      // BCB
      { bank_id: bankNameToId['Banque Commerciale du Burkina (BCB)'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1500, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Commerciale du Burkina (BCB)'], type: 'COMPTE SALARIE', monthly_fee: 1500, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Commerciale du Burkina (BCB)'], type: 'COMPTE ENTREPRISE', monthly_fee: 6000, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },

      // SGBF
      { bank_id: bankNameToId['Société Générale Burkina Faso (SGBF)'], type: 'COMPTE INDIVIDUEL', monthly_fee: 2000, currency: 'FCFA', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Société Générale Burkina Faso (SGBF)'], type: 'COMPTE ENTREPRISE', monthly_fee: 7500, currency: 'FCFA', notes: 'SARL', monthly_fee_is_ttc: false, created_at: new Date(), updated_at: new Date() },

      // CBAO
      { bank_id: bankNameToId['CBAO Burkina Faso'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['CBAO Burkina Faso'], type: 'COMPTE ENTREPRISE', monthly_fee: 5000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // Orabank
      { bank_id: bankNameToId['Orabank Burkina Faso'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1100, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Orabank Burkina Faso'], type: 'COMPTE ENTREPRISE', monthly_fee: 500, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // UBA
      { bank_id: bankNameToId['UBA Burkina Faso'], type: 'COMPTE D EPARGNE', monthly_fee: 0, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['UBA Burkina Faso'], type: 'COMPTE COMMERCANT', monthly_fee: 3000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // Banque Atlantique
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1800, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], type: 'COMPTE SALARIE', monthly_fee: 1200, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], type: 'COMPTE ENTREPRISE', monthly_fee: 5000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], type: 'COMPTE D EPARGNE', monthly_fee: 0, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], type: 'COMPTE COMMERCANT', monthly_fee: 3000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // IB Bank
      { bank_id: bankNameToId['IB Bank Burkina Faso'], type: 'COMPTE INDIVIDUEL', monthly_fee: 1600, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['IB Bank Burkina Faso'], type: 'COMPTE SALARIE', monthly_fee: 1000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['IB Bank Burkina Faso'], type: 'COMPTE ENTREPRISE', monthly_fee: 4000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['IB Bank Burkina Faso'], type: 'COMPTE D EPARGNE', monthly_fee: 0, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['IB Bank Burkina Faso'], type: 'COMPTE COMMERCANT', monthly_fee: 2500, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },

      // Coris Bank International
      { bank_id: bankNameToId['Coris Bank International'], type: 'COMPTE INDIVIDUEL', monthly_fee: 995, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Coris Bank International'], type: 'COMPTE SALARIE', monthly_fee: 0, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Coris Bank International'], type: 'COMPTE ENTREPRISE', monthly_fee: 3000, currency: 'FCFA', created_at: new Date(), updated_at: new Date() },
    ];

    await queryInterface.bulkInsert('bank_accounts', bankAccounts, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bank_accounts', null, {});
  }
};

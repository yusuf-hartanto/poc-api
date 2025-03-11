'use strict';

export default class DataMenu {
  public menu() {
    return [
      {
        id: 1,
        menu_name: 'Dashboard',
        menu_icon: 'tabler-dashboard',
        module_name: 'dashboard',
        seq_number: 1,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
      {
        id: 2,
        menu_name: 'Insurance',
        menu_icon: 'tabler-ambulance',
        module_name: '#',
        seq_number: 2,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
      {
        id: 3,
        menu_name: 'Master Survey',
        menu_icon: 'tabler-ad-2',
        module_name: 'master/survey',
        seq_number: 3,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
      {
        id: 4,
        menu_name: 'Settings',
        menu_icon: 'tabler-smart-home',
        module_name: '#',
        seq_number: 4,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
    ];
  }

  public childmenu() {
    return [
      {
        parent_id: 2,
        menu_name: 'Client',
        menu_icon: 'Users',
        module_name: 'insurance/client',
        seq_number: 21,
        status: 1,
      },
      {
        parent_id: 2,
        menu_name: 'Policy',
        menu_icon: 'tabler-ambulance',
        module_name: 'insurance/policy',
        seq_number: 22,
        status: 1,
      },
      {
        parent_id: 2,
        menu_name: 'Record',
        menu_icon: 'Activity',
        module_name: 'record',
        seq_number: 23,
        status: 1,
      },
      {
        parent_id: 3,
        menu_name: 'Event',
        menu_icon: 'Circle',
        module_name: 'event',
        seq_number: 31,
        status: 1,
      },
      {
        parent_id: 3,
        menu_name: 'Form',
        menu_icon: 'Circle',
        module_name: 'form',
        seq_number: 32,
        status: 1,
      },
      {
        parent_id: 4,
        menu_name: 'Menu',
        menu_icon: 'Circle',
        module_name: 'master/menu',
        seq_number: 41,
        status: 1,
      },
      {
        parent_id: 4,
        menu_name: 'Role',
        menu_icon: 'Circle',
        module_name: 'master/role',
        seq_number: 42,
        status: 1,
      },
      {
        parent_id: 4,
        menu_name: 'Role Menu',
        menu_icon: 'Circle',
        module_name: 'role_menu',
        seq_number: 43,
        status: 1,
      },
      {
        parent_id: 4,
        menu_name: 'User',
        menu_icon: 'Circle',
        module_name: 'master/user',
        seq_number: 44,
        status: 1,
      },
      {
        parent_id: 4,
        menu_name: 'Global Param',
        menu_icon: 'Circle',
        module_name: 'global_param',
        seq_number: 45,
        status: 1,
      },
    ];
  }
}
export const datamenu = new DataMenu();

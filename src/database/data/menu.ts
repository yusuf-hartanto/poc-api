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
        menu_icon: 'tabler-script',
        module_name: 'insurance',
        seq_number: 2,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
      {
        id: 3,
        menu_name: 'Assesment',
        menu_icon: 'tabler-ad-2',
        module_name: 'assesment',
        seq_number: 3,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
      {
        id: 4,
        menu_name: 'Properties',
        menu_icon: 'tabler-building-estate',
        module_name: 'properties',
        seq_number: 4,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
      {
        id: 5,
        menu_name: 'Client',
        menu_icon: 'tabler-users-group',
        module_name: 'client',
        seq_number: 88,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
      {
        id: 6,
        menu_name: 'Settings',
        menu_icon: 'tabler-smart-home',
        module_name: '#',
        seq_number: 99,
        parent_id: '00000000-0000-0000-0000-000000000000',
        status: 1,
      },
    ];
  }

  public childmenu() {
    return [
      {
        parent_id: 6,
        menu_name: 'Menu',
        menu_icon: 'Circle',
        module_name: 'master/menu',
        seq_number: 91,
        status: 1,
      },
      {
        parent_id: 6,
        menu_name: 'Role',
        menu_icon: 'Circle',
        module_name: 'master/role',
        seq_number: 92,
        status: 1,
      },
      {
        parent_id: 6,
        menu_name: 'User',
        menu_icon: 'Circle',
        module_name: 'master/user',
        seq_number: 93,
        status: 1,
      },
    ];
  }
}
export const datamenu = new DataMenu();

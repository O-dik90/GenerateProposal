import { BookOutlined, ChromeOutlined } from '@ant-design/icons';

const icons = {
  ChromeOutlined,
  BookOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const proposal = {
  id: 'proposal',
  title: 'Proposal',
  type: 'group',
  children: [
    {
      id: 'proposal-table',
      title: 'Proposal Tabel',
      type: 'item',
      url: '/',
      icon: icons.BookOutlined
    }
  ]
};

export default proposal;

// ** Regional Identitas
export const ID_INIT = {
  no: 0,
  role_person: '',
  name: '',
  gender: '',
  id_no: '',
  birth_place: '',
  birth_date: '',
  email: '',
  phone: '',
  status: false,
  act: [],
  award: [],
  education: [],
  course: [],
  research: [],
  community_service: []
};
export const ACT_INIT = {
  no: 0,
  id_personel: 0,
  act_name: '',
  act_role: '',
  act_start_date: '',
  act_end_date: '',
  status: false
};
export const AWARD_INIT = {
  no: 0,
  id_personel: 0,
  award_name: '',
  award_year: '',
  award_giver: '',
  status: false
};
export const EDUCATION_INIT = {
  no: 0,
  id_personel: 0,
  degree: '',
  major: '',
  institution: '',
  graduation_year: '',
  status: false
};
export const COURSE_INIT = {
  no: 0,
  id_personel: 0,
  course_name: '',
  course_type: '',
  credits: '',
  status: false
};
export const RESEARCH_INIT = {
  no: 0,
  id_personel: 0,
  research_title: '',
  research_source: '',
  research_year: '',
  status: false
};
export const COMMUNITY_INIT = {
  no: 0,
  id_personel: 0,
  com_title: '',
  com_source: '',
  com_year: '',
  status: false
};

export const DEFAULT_ID_INIT = [
  {
    no: 1,
    role_person: 'KETUA',
    name: 'odik y n',
    gender: 'L',
    id_no: '12234567',
    birth_place: 'Klaten',
    birth_date: '1998-10-18',
    email: 'nugrohoodik90@gmail.com',
    phone: '098766543321',
    status: false,
    act: [
      {
        no: 1,
        id_personel: 1,
        act_name: 'Kegiatan 1',
        act_role: 'Ketua',
        act_start_date: '2022-01-01',
        act_end_date: '2022-01-01',
        status: false
      }
    ],
    award: [
      {
        no: 1,
        id_personel: 1,
        award_name: 'Penghargaan 1',
        award_year: '2022',
        award_giver: 'Pemberi Penghargaan 1'
      }
    ],
    education: [],
    course: [],
    research: [],
    community_service: []
  }
];

// ** Regional Anggaran
export const BUDGET_INIT = {
  total_price: '',
  materials: [],
  services: [],
  transports: [],
  others: []
};

export const DETAIL_BUDGET_INIT = {
  no: 0,
  category: '',
  output_type: '',
  budget_source: '',
  volume: '',
  unit_price: '',
  total_price: '',
  status: false
};

// ** Regional Susunan Tim
export const STRUCTURE_INIT = {
  no: 0,
  name: '',
  program: '',
  id_no: '',
  major: '',
  time_allocation: '',
  task_description: ''
};

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
  add_data: {
    act: [],
    awards: [],
    education: [],
    course: [],
    research: [],
    comunity_service: []
  }
};
export const ACT_INIT = {
  no: 0,
  type: '',
  act_name: '',
  act_role: '',
  act_start_date: '',
  act_end_date: '',
  status: false
};
export const AWARDS_INIT = {
  no: 0,
  type: '',
  award_name: '',
  award_year: '',
  award_giver: ''
};
export const EDUCATION_INIT = {
  no: 0,
  type: '',
  degree: '',
  major: '',
  institution: '',
  graduation_year: ''
};
export const COURSE_INIT = {
  no: 0,
  type: '',
  course_name: '',
  course_type: '',
  credits: ''
};
export const RESEARCH_INIT = {
  no: 0,
  type: '',
  research_title: '',
  research_source: '',
  research_year: ''
};
export const COMMUNITY_INIT = {
  no: 0,
  type: '',
  com_title: '',
  com_source: '',
  com_year: ''
};

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

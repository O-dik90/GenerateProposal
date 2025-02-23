export const BOOK_INIT = {
  no: 0,
  type: '', //required
  title: '', //required
  author: [], //required
  publisher: '', //required
  publisher_place: '', //required
  date_parts: '',
  issued: { date_parts: [] }, //required
  edition: '',
  volume: '',
  ISBN: '',
  page: '',
  abstract: '',
  URL: '',
  access_date: '',
  accessed: { date_parts: [] },
  style: 'apa',
  status: false
};
export const JOURNAL_INIT = {
  no: 0,
  type: '', //required
  title: '', //required
  author: [], //required
  container_title: '', //required
  publisher: '',
  publisher_place: '',
  date_parts: '',
  issued: { date_parts: [] }, //required
  volume: '', //required
  issue: '', //required
  page: '', //required
  DOI: '',
  issn: '',
  abstract: '',
  URL: '',
  access_date: '',
  accessed: { date_parts: [] },
  style: 'apa',
  status: false
};
export const URL_INIT = {
  no: 0,
  type: '', //required
  title: '', //required
  author: [], //required
  container_title: '',
  publisher: '',
  URL: '', //required
  date_parts: '',
  issued: { date_parts: [] }, //required
  access_date: '',
  accessed: { date_parts: [] },
  abstract: '',
  language: '',
  note: '',
  style: 'apa',
  status: false
};
export const AUTHOR_INIT = {
  no: 0,
  given: '', //first name
  family: '', //last name
  status: false
};

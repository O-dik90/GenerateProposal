const validateField = (name, value) => {
  let error = '';

  switch (name) {
    case 'price':
      if (!value) {
        error = 'Price is required';
      } else if (isNaN(value) || value <= 0) {
        error = 'Price must be a positive number';
      }
      break;

    case 'publish_year':
      if (!value) {
        error = 'Publish year is required';
      } else if (!/^\d{4}$/.test(value)) {
        error = 'Enter a valid 4-digit year';
      }
      break;

    case 'title_journal':
      if (!value) {
        error = 'Title is required';
      } else if (value.length < 3) {
        error = 'Title must be at least 3 characters';
      }
      break;
    case 'author':
      if (!value) {
        error = 'Author is required';
      } else if (value.length < 2) {
        error = 'Author name must be at least 2 characters';
      }
      break;
    default:
      break;
  }
  return error;
};

export default validateField;

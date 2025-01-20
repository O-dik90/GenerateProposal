// utils/formatUtils.js

export const formatNumber = (number, locale = 'id-ID') => {
  const formattedNumber = new Intl.NumberFormat(locale, {
    style: 'decimal'
  }).format(number);

  return formattedNumber;
};

export const formatCurrency = (value) => {
  if (!value) return '';
  let formattedValue = value.replace(/\D/g, '');
  if (formattedValue.length > 0) {
    formattedValue = (parseInt(formattedValue, 10) || 0).toString();
  }
  return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const handleCurrencyInputChange = (e) => {
  let rawValue = e.target.value.replace(/[^\d]/g, '');
  onChange({ target: { name, value: rawValue } });
};

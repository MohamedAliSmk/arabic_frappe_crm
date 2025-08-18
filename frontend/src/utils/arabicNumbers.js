/**
 * Convert numbers to Arabic numerals
 * @param {number|string} num - The number to convert
 * @returns {string} - The number in Arabic numerals
 */
export function toArabicNumbers(num) {
  if (num === null || num === undefined || num === '') {
    return '0';
  }
  
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let numStr = num.toString();
  
  // Convert each digit to Arabic
  for (let i = 0; i < englishNumerals.length; i++) {
    numStr = numStr.replace(new RegExp(englishNumerals[i], 'g'), arabicNumerals[i]);
  }
  
  return numStr;
}

/**
 * Format currency with Arabic numerals
 * @param {number} value - The currency value
 * @param {string} currency - The currency symbol (default: 'ر.س')
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted currency with Arabic numerals
 */
export function formatArabicCurrency(value, currency = 'ر.س', decimals = 2) {
  if (value === null || value === undefined || value === '') {
    return `${currency}٠`;
  }
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return `${currency}٠`;
  }
  
  const formattedNumber = numValue.toFixed(decimals);
  const arabicNumber = toArabicNumbers(formattedNumber);
  
  return `${currency}${arabicNumber}`;
}

/**
 * Format numbers with Arabic numerals and suffix
 * @param {number} value - The number value
 * @param {string} suffix - The suffix to add (e.g., 'أيام')
 * @returns {string} - Formatted number with Arabic numerals and suffix
 */
export function formatArabicNumberWithSuffix(value, suffix) {
  if (value === null || value === undefined || value === '') {
    return `٠${suffix}`;
  }
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return `٠${suffix}`;
  }
  
  const arabicNumber = toArabicNumbers(Math.round(numValue));
  return `${arabicNumber}${suffix}`;
}

/**
 * Check if the current language is Arabic
 * @returns {boolean} - True if the language is Arabic
 */
export function isArabicLanguage() {
  return document.documentElement.lang === 'ar' || 
         document.documentElement.dir === 'rtl' ||
         navigator.language.startsWith('ar');
}
/**



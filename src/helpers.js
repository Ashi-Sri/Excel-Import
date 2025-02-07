// src/helpers.js

export const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options); // Format as DD-MM-YYYY
  };
  
  export const formatNumber = (number) => {
    return number.toLocaleString('en-IN'); // Indian Number Format
  };
  
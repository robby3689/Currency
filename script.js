document.addEventListener('DOMContentLoaded', function () {
    // Fetch and populate currency dropdowns
    fetchCurrencies();
  
    // Set default values for currencies
    document.getElementById('fromCurrency').value = 'INR';
    document.getElementById('toCurrency').value = 'INR';
  
    // Add event listeners for real-time conversion
    document.getElementById('amount').addEventListener('input', convertCurrency);
    document.getElementById('fromCurrency').addEventListener('change', convertCurrency);
    document.getElementById('toCurrency').addEventListener('change', convertCurrency);
  
    // Add event listener for currency swap
    document.getElementById('swapBtn').addEventListener('click', swapCurrencies);
  
    // Initial conversion
    convertCurrency();
  });
  
  function fetchCurrencies() {
    const selectFrom = document.getElementById('fromCurrency');
    const selectTo = document.getElementById('toCurrency');
  
    // Fetch list of currencies from ExchangeRate-API
    fetch('https://open.er-api.com/v6/latest')
      .then(response => response.json())
      .then(data => {
        const currencies = Object.keys(data.rates);
  
        currencies.forEach(currency => {
          const option = document.createElement('option');
          option.value = currency;
          option.text = `${currency} - ${getCurrencySymbol(currency)}`;
          selectFrom.add(option);
  
          const optionTo = document.createElement('option');
          optionTo.value = currency;
          optionTo.text = `${currency} - ${getCurrencySymbol(currency)}`;
          selectTo.add(optionTo);
        });
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  }
  
  function convertCurrency() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const amount = parseFloat(document.getElementById('amount').value);
  
    if (isNaN(amount)) {
      alert('Please enter a valid amount.');
      return;
    }
  
    fetch('https://open.er-api.com/v6/latest')
      .then(response => response.json())
      .then(data => {
        const rate = data.rates[toCurrency] / data.rates[fromCurrency];
        const convertedAmount = (amount * rate).toFixed(2);
  
        document.getElementById('result').innerHTML = `
          ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}
        `;
      })
      .catch(error => {
        console.error('Error converting currency:', error);
      });
  
    // Save user preferences to local storage
    saveUserPreferences();
  }
  
  function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
  
    // Swap the currencies
    document.getElementById('fromCurrency').value = toCurrency;
    document.getElementById('toCurrency').value = fromCurrency;
  
    // Trigger conversion with swapped currencies
    convertCurrency();
  }
  
  function getCurrencySymbol(currencyCode) {
    // Add logic to fetch currency symbols based on currency codes
    // For simplicity, returning currency code as symbol
    return currencyCode;
  }
  
  function saveUserPreferences() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
  
    // Save user preferences to local storage
    localStorage.setItem('userPreferences', JSON.stringify({ fromCurrency, toCurrency }));
  }
  
  // Load user preferences from local storage
  document.addEventListener('DOMContentLoaded', function () {
    const userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    document.getElementById('fromCurrency').value = userPreferences.fromCurrency || 'INR';
    document.getElementById('toCurrency').value = userPreferences.toCurrency || 'INR';
  });
  
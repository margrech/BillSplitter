let diners = [];

const currencies = {
  USD: {
    symbol: '$',
    name: 'USD',
    denominations: [
      { value: 100, label: '$100 bill' },
      { value: 50, label: '$50 bill' },
      { value: 20, label: '$20 bill' },
      { value: 10, label: '$10 bill' },
      { value: 5, label: '$5 bill' },
      { value: 1, label: '$1 bill' },
      { value: 0.25, label: '25¢ coin' },
      { value: 0.10, label: '10¢ coin' },
      { value: 0.05, label: '5¢ coin' },
      { value: 0.01, label: '1¢ coin' }
    ]
  },
  EUR: {
    symbol: '€',
    name: 'EUR',
    denominations: [
      { value: 500, label: '€500 bill' },
      { value: 200, label: '€200 bill' },
      { value: 100, label: '€100 bill' },
      { value: 50, label: '€50 bill' },
      { value: 20, label: '€20 bill' },
      { value: 10, label: '€10 bill' },
      { value: 5, label: '€5 bill' },
      { value: 2, label: '€2 coin' },
      { value: 1, label: '€1 coin' },
      { value: 0.50, label: '50¢ coin' },
      { value: 0.20, label: '20¢ coin' },
      { value: 0.10, label: '10¢ coin' },
      { value: 0.05, label: '5¢ coin' },
      { value: 0.02, label: '2¢ coin' },
      { value: 0.01, label: '1¢ coin' }
    ]
  },
  GBP: {
    symbol: '£',
    name: 'GBP',
    denominations: [
      { value: 50, label: '£50 note' },
      { value: 20, label: '£20 note' },
      { value: 10, label: '£10 note' },
      { value: 5, label: '£5 note' },
      { value: 2, label: '£2 coin' },
      { value: 1, label: '£1 coin' },
      { value: 0.50, label: '50p coin' },
      { value: 0.20, label: '20p coin' },
      { value: 0.10, label: '10p coin' },
      { value: 0.05, label: '5p coin' },
      { value: 0.02, label: '2p coin' },
      { value: 0.01, label: '1p coin' }
    ]
  }
};

let currentCurrency = currencies.USD;

function changeCurrency() {
  const currencySelect = document.getElementById('currency-select');
  currentCurrency = currencies[currencySelect.value];
  
  // Update all currency symbols on the page
  document.querySelectorAll('.currency-symbol').forEach(element => {
    element.textContent = currentCurrency.symbol;
  });
  
  // Update amounts that include the currency symbol
  updateDenominationsDisplay();
  updateCalculations();
}

function updateDenominationsDisplay() {
  const container = document.getElementById('cash-denominations');
  container.innerHTML = '';

  currentCurrency.denominations.forEach(denom => {
    const row = document.createElement('div');
    row.className = 'denomination-row';
    row.innerHTML = `
      <span>${denom.label}</span>
      <input type="number" min="0" class="denomination-count" 
        data-value="${denom.value}" onchange="calculateDenominationTotal()">
      <span class="total">${currentCurrency.symbol}0.00</span>
    `;
    container.appendChild(row);
  });
}

function calculateDenominationTotal() {
  let total = 0;
  const rows = document.querySelectorAll('.denomination-row');
  
  rows.forEach(row => {
    const input = row.querySelector('.denomination-count');
    const totalSpan = row.querySelector('.total');
    const value = parseFloat(input.dataset.value);
    const count = parseInt(input.value) || 0;
    const rowTotal = value * count;
    total += rowTotal;
    totalSpan.textContent = `${currentCurrency.symbol}${rowTotal.toFixed(2)}`;
  });

  document.getElementById('denomination-total').textContent = 
    `${currentCurrency.symbol}${total.toFixed(2)}`;
  
  updateCashReconciliation();
}

function addDiner() {
  const dinersList = document.getElementById('diners-list');
  const dinerId = Date.now();
  
  const dinerEntry = document.createElement('div');
  dinerEntry.className = 'diner-entry';
  dinerEntry.innerHTML = `
    <input type="text" class="diner-name" placeholder="Enter name" onchange="updateCalculations()">
    <select class="diner-type" onchange="updateCalculations()">
      <option value="adult">Adult (1 share)</option>
      <option value="child">Child (0.5 share)</option>
      <option value="baby">Baby (0 share)</option>
    </select>
    <select class="payment-method" onchange="updateCalculations()">
      <option value="cash">Cash</option>
      <option value="credit">Credit Card</option>
      <option value="transfer">Transfer</option>
    </select>
    <span class="amount"></span>
    <button class="remove-diner" onclick="removeDiner(${dinerId})">Remove</button>
  `;
  
  dinersList.appendChild(dinerEntry);
  diners.push({
    id: dinerId,
    element: dinerEntry
  });
  
  updateCalculations();
}

function removeDiner(id) {
  const index = diners.findIndex(diner => diner.id === id);
  if (index > -1) {
    diners[index].element.remove();
    diners.splice(index, 1);
    updateCalculations();
  }
}

function updateCalculations() {
  const billAmount = parseFloat(document.getElementById('total-bill').value) || 0;
  const amountPerShareInput = parseFloat(document.getElementById('amount-per-share-input').value) || 0;
  let totalShares = 0;
  let cashTotal = 0;
  let creditTotal = 0;
  let transferTotal = 0;

  document.querySelectorAll('.diner-entry').forEach(entry => {
    const type = entry.querySelector('.diner-type').value;
    let shares = 0;
    switch(type) {
      case 'adult': shares = 1; break;
      case 'child': shares = 0.5; break;
      case 'baby': shares = 0; break;
    }
    totalShares += shares;
  });

  const totalWithTip = totalShares * amountPerShareInput;
  const tipAmount = totalWithTip - billAmount;
  const tipPercentage = billAmount > 0 ? (tipAmount / billAmount) * 100 : 0;
  const amountPerShareNoTip = totalShares > 0 ? billAmount / totalShares : 0;

  document.getElementById('total-with-tip').textContent = `${totalWithTip.toFixed(2)}`;
  document.getElementById('tip-amount').textContent = `${tipAmount.toFixed(2)}`;
  document.getElementById('tip-percentage').textContent = `${tipPercentage.toFixed(1)}%`;
  document.getElementById('amount-per-share-no-tip').textContent = `${amountPerShareNoTip.toFixed(2)}`;

  document.querySelectorAll('.diner-entry').forEach(entry => {
    const type = entry.querySelector('.diner-type').value;
    const paymentMethod = entry.querySelector('.payment-method').value;
    const amountSpan = entry.querySelector('.amount');
    
    let shares = 0;
    switch(type) {
      case 'adult': shares = 1; break;
      case 'child': shares = 0.5; break;
      case 'baby': shares = 0; break;
    }
    
    const amount = shares * amountPerShareInput;
    amountSpan.textContent = `${currentCurrency.symbol}${amount.toFixed(2)}`;
    
    switch(paymentMethod) {
      case 'cash': cashTotal += amount; break;
      case 'credit': creditTotal += amount; break;
      case 'transfer': transferTotal += amount; break;
    }
  });

  document.getElementById('total-shares').textContent = totalShares.toFixed(1);
  document.getElementById('amount-per-share').textContent = `${amountPerShareInput.toFixed(2)}`;
  document.getElementById('amount-per-share-summary').textContent = `${amountPerShareNoTip.toFixed(2)}`;
  document.getElementById('cash-total').textContent = `${cashTotal.toFixed(2)}`;
  document.getElementById('credit-total').textContent = `${creditTotal.toFixed(2)}`;
  document.getElementById('transfer-total').textContent = `${transferTotal.toFixed(2)}`;
  
  document.getElementById('expected-cash-total').textContent = `${currentCurrency.symbol}${cashTotal.toFixed(2)}`;
  
  updatePaymentList();
  updateCashReconciliation();
}

function updatePaymentList() {
  const cashList = document.getElementById('cash-list');
  const creditList = document.getElementById('credit-list');
  const transferList = document.getElementById('transfer-list');
  
  if (!cashList || !creditList || !transferList) return;
  
  cashList.innerHTML = '';
  creditList.innerHTML = '';
  transferList.innerHTML = '';
  
  document.querySelectorAll('.diner-entry').forEach(entry => {
    const nameInput = entry.querySelector('.diner-name');
    const typeSelect = entry.querySelector('.diner-type');
    const paymentSelect = entry.querySelector('.payment-method');
    const amountSpan = entry.querySelector('.amount');
    
    if (!nameInput || !typeSelect || !paymentSelect || !amountSpan) return;
    
    const name = nameInput.value || 'Unnamed';
    const type = typeSelect.value;
    const paymentMethod = paymentSelect.value;
    const amount = parseFloat(amountSpan.textContent.replace(currentCurrency.symbol, '')) || 0;
    
    const listItem = document.createElement('li');
    listItem.textContent = `${name} (${type}): ${currentCurrency.symbol}${amount.toFixed(2)}`;
    
    switch(paymentMethod) {
      case 'cash': cashList.appendChild(listItem); break;
      case 'credit': creditList.appendChild(listItem); break;
      case 'transfer': transferList.appendChild(listItem); break;
    }
  });
}

function updateCashReconciliation() {
  const cashTotalElement = document.getElementById('cash-total');
  if (!cashTotalElement) return;
  
  const cashExpected = parseFloat(cashTotalElement.textContent) || 0;
  const cashCollected = getCashCollectedFromDenominations();
  const difference = cashCollected - cashExpected;
  
  const status = document.getElementById('reconciliation-status');
  if (!status) return;
  
  if (cashCollected === 0) {
    status.textContent = 'Enter cash collected amount';
    status.className = 'reconciliation-status';
  } else if (Math.abs(difference) < 0.01) {
    status.textContent = 'Cash reconciliation matches!';
    status.className = 'reconciliation-status match';
  } else {
    const text = difference > 0 ? 
      `Excess cash: ${currentCurrency.symbol}${difference.toFixed(2)}` :
      `Missing cash: ${currentCurrency.symbol}${Math.abs(difference).toFixed(2)}`;
    status.textContent = text;
    status.className = 'reconciliation-status mismatch';
  }
}

function getCashCollectedFromDenominations() {
  let total = 0;
  const rows = document.querySelectorAll('.denomination-row');
  
  rows.forEach(row => {
    const input = row.querySelector('.denomination-count');
    if (input) {
      const value = parseFloat(input.dataset.value) || 0;
      const count = parseInt(input.value) || 0;
      total += value * count;
    }
  });
  
  return total;
}

document.addEventListener('DOMContentLoaded', () => {
  const billInput = document.getElementById('total-bill');
  const shareInput = document.getElementById('amount-per-share-input');
  
  if (billInput) {
    billInput.addEventListener('input', updateCalculations);
  }
  if (shareInput) {
    shareInput.addEventListener('input', updateCalculations);
  }
  
  updateDenominationsDisplay();
  updateCalculations();
});
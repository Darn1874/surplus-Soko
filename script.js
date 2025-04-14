// Data structure for localStorage
const STORAGE_KEYS = {
    FARMERS: 'surplus_soko_farmers',
    BUYERS: 'surplus_soko_buyers',
    TRANSACTIONS: 'surplus_soko_transactions',
    COMMODITIES: 'surplus_soko_commodities',
    SMS_LOGS: 'surplus_soko_sms_logs'
};

// Initialize data if not exists
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.FARMERS)) {
        const sampleFarmers = [
            { id: 'F001', name: 'John Kamau', phone: '+254712345678', location: 'Nairobi', crops: ['Tomatoes', 'Kale'], lastActive: '2023-05-15' },
            { id: 'F002', name: 'Mary Wanjiku', phone: '+254723456789', location: 'Kiambu', crops: ['Carrots', 'Spinach'], lastActive: '2023-05-14' },
            { id: 'F003', name: 'Peter Mwangi', phone: '+254734567890', location: 'Nakuru', crops: ['Potatoes', 'Onions'], lastActive: '2023-05-10' }
        ];
        localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(sampleFarmers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.BUYERS)) {
        const sampleBuyers = [
            { id: 'B001', name: 'Nakuru Market', phone: '+254745678901', location: 'Nakuru', interests: ['Tomatoes', 'Onions'] },
            { id: 'B002', name: 'FreshCo Ltd', phone: '+254756789012', location: 'Nairobi', interests: ['Kale', 'Spinach'] },
            { id: 'B003', name: 'GreenGrocers', phone: '+254767890123', location: 'Nairobi', interests: ['Carrots', 'Potatoes'] }
        ];
        localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(sampleBuyers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
        const sampleTransactions = [
            { id: 'TRX001', farmerId: 'F001', buyerId: 'B001', produce: 'Tomatoes (50kg)', amount: 3500, date: '2023-05-10', status: 'completed' },
            { id: 'TRX002', farmerId: 'F002', buyerId: 'B002', produce: 'Kale (20kg)', amount: 1200, date: '2023-05-12', status: 'completed' },
            { id: 'TRX003', farmerId: 'F003', buyerId: 'B003', produce: 'Carrots (30kg)', amount: 2100, date: '2023-05-14', status: 'pending' }
        ];
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTransactions));
    }

    if (!localStorage.getItem(STORAGE_KEYS.COMMODITIES)) {
        const sampleCommodities = [
            { name: 'Tomatoes', currentPrice: 70, trend: 'up', demand: 'high', unit: 'kg' },
            { name: 'Kale', currentPrice: 60, trend: 'neutral', demand: 'medium', unit: 'kg' },
            { name: 'Carrots', currentPrice: 65, trend: 'down', demand: 'medium', unit: 'kg' },
            { name: 'Onions', currentPrice: 55, trend: 'up', demand: 'high', unit: 'kg' },
            { name: 'Potatoes', currentPrice: 45, trend: 'down', demand: 'low', unit: 'kg' }
        ];
        localStorage.setItem(STORAGE_KEYS.COMMODITIES, JSON.stringify(sampleCommodities));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SMS_LOGS)) {
        localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify([]));
    }
}

// Helper functions for localStorage operations
function getFarmers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FARMERS)) || [];
}

function getBuyers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUYERS)) || [];
}

function getTransactions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
}

function getCommodities() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMODITIES)) || [];
}

function getSmsLogs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SMS_LOGS)) || [];
}

function saveFarmers(farmers) {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
}

function saveBuyers(buyers) {
    localStorage.setItem(STORAGE_KEYS.BUYERS, JSON.stringify(buyers));
}

function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

function saveCommodities(commodities) {
    localStorage.setItem(STORAGE_KEYS.COMMODITIES, JSON.stringify(commodities));
}

function saveSmsLogs(logs) {
    localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(logs));
}

// DOM Elements
const transactionsTable = document.getElementById('transactions-table').getElementsByTagName('tbody')[0];
const pricesTable = document.getElementById('prices-table').getElementsByTagName('tbody')[0];
const smsForm = document.getElementById('sms-form');
const smsMessage = document.getElementById('sms-message');
const charRemaining = document.getElementById('char-remaining');
const bulkSmsModal = document.getElementById('bulk-sms-modal');
const bulkSmsBtn = document.getElementById('send-bulk-sms');
const closeModal = document.getElementsByClassName('close')[0];
const systemStatusItems = document.querySelectorAll('.system-status .value');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateDashboard();
    setupEventListeners();
});

function updateDashboard() {
    loadTransactions();
    loadMarketPrices();
    updateSystemStatus();
}

function loadTransactions() {
    const transactions = getTransactions();
    const farmers = getFarmers();
    const buyers = getBuyers();

    transactionsTable.innerHTML = '';
    
    transactions.forEach(transaction => {
        const farmer = farmers.find(f => f.id === transaction.farmerId) || { name: 'Unknown Farmer' };
        const buyer = buyers.find(b => b.id === transaction.buyerId) || { name: 'Unknown Buyer' };
        
        const row = transactionsTable.insertRow();
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${farmer.name}</td>
            <td>${buyer.name}</td>
            <td>${transaction.produce}</td>
            <td>KSh ${transaction.amount.toLocaleString()}</td>
            <td><span class="status-badge status-${transaction.status}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span></td>
        `;
    });
}

function loadMarketPrices() {
    const commodities = getCommodities();
    
    pricesTable.innerHTML = '';
    
    commodities.forEach(item => {
        const row = pricesTable.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>KSh ${item.currentPrice}/${item.unit}</td>
            <td><i class="fas fa-arrow-${item.trend === 'up' ? 'up trend-up' : item.trend === 'down' ? 'down trend-down' : 'right trend-neutral'}"></i></td>
            <td>${item.demand.charAt(0).toUpperCase() + item.demand.slice(1)}</td>
        `;
    });
}

function updateSystemStatus() {
    const farmers = getFarmers();
    const buyers = getBuyers();
    const transactions = getTransactions();
    const today = new Date().toISOString().split('T')[0];
    
    const todayTransactions = transactions.filter(t => t.date === today);
    
    systemStatusItems[0].textContent = '1,245'; // SMS Balance (mock)
    systemStatusItems[1].textContent = farmers.length.toLocaleString();
    systemStatusItems[2].textContent = buyers.length.toLocaleString();
    systemStatusItems[3].textContent = todayTransactions.length.toLocaleString();
}

function setupEventListeners() {
    // SMS character counter
    smsMessage.addEventListener('input', function() {
        const remaining = 160 - this.value.length;
        charRemaining.textContent = remaining;
        if (remaining < 20) {
            charRemaining.style.color = 'var(--danger)';
        } else if (remaining < 50) {
            charRemaining.style.color = 'var(--warning)';
        } else {
            charRemaining.style.color = 'var(--gray)';
        }
    });

    // SMS form submission
    smsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const recipients = document.getElementById('sms-recipients');
        const selectedOptions = Array.from(recipients.selectedOptions).map(option => option.value);
        
        if (selectedOptions.length === 0) {
            alert('Please select at least one recipient group');
            return;
        }
        
        if (smsMessage.value.trim() === '') {
            alert('Please enter a message');
            return;
        }
        
        // Log the SMS (in a real app, this would send to SMS gateway)
        const smsLogs = getSmsLogs();
        const newLog = {
            id: 'SMS-' + Date.now(),
            recipients: selectedOptions,
            message: smsMessage.value,
            date: new Date().toISOString(),
            status: 'simulated'
        };
        
        smsLogs.push(newLog);
        saveSmsLogs(smsLogs);
        
        alert(`SMS simulated to ${selectedOptions.length} group(s). In a real app, this would be sent to actual farmers.`);
        smsForm.reset();
        charRemaining.textContent = '160';
    });

    // Bulk SMS modal
    bulkSmsBtn.addEventListener('click', function() {
        bulkSmsModal.style.display = 'block';
        loadBulkSmsModal();
    });

    closeModal.addEventListener('click', function() {
        bulkSmsModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === bulkSmsModal) {
            bulkSmsModal.style.display = 'none';
        }
    });
}

function loadBulkSmsModal() {
    const farmers = getFarmers();
    const locations = [...new Set(farmers.map(f => f.location))];
    
    const modalContent = `
        <div class="form-group">
            <label for="bulk-sms-recipients">Select Farmers</label>
            <select id="bulk-sms-recipients" multiple>
                <optgroup label="By Location">
                    ${locations.map(loc => `<option value="loc-${loc}">${loc} Region</option>`).join('')}
                </optgroup>
                <optgroup label="By Crop">
                    ${[...new Set(farmers.flatMap(f => f.crops))].map(crop => 
                        `<option value="crop-${crop}">${crop} Farmers</option>`
                    ).join('')}
                </optgroup>
                <option value="all">All Farmers</option>
            </select>
        </div>
        <div class="form-group">
            <label for="bulk-sms-message">Message</label>
            <textarea id="bulk-sms-message" rows="6" maxlength="160" placeholder="Type your SMS message here (160 characters max)"></textarea>
            <div class="char-count"><span id="bulk-char-remaining">160</span> characters remaining</div>
        </div>
        <button type="button" id="send-bulk-sms-btn" class="btn-primary">Send Bulk SMS</button>
    `;
    
    document.getElementById('bulk-sms-form').innerHTML = modalContent;
    
    // Set up event listeners for the modal
    const bulkSmsMessage = document.getElementById('bulk-sms-message');
    const bulkCharRemaining = document.getElementById('bulk-char-remaining');
    
    bulkSmsMessage?.addEventListener('input', function() {
        const remaining = 160 - this.value.length;
        bulkCharRemaining.textContent = remaining;
        if (remaining < 20) {
            bulkCharRemaining.style.color = 'var(--danger)';
        } else if (remaining < 50) {
            bulkCharRemaining.style.color = 'var(--warning)';
        } else {
            bulkCharRemaining.style.color = 'var(--gray)';
        }
    });
    
    document.getElementById('send-bulk-sms-btn')?.addEventListener('click', function() {
        const recipients = document.getElementById('bulk-sms-recipients');
        const selectedOptions = Array.from(recipients.selectedOptions).map(option => option.value);
        const message = bulkSmsMessage.value.trim();
        
        if (selectedOptions.length === 0) {
            alert('Please select at least one recipient group');
            return;
        }
        
        if (message === '') {
            alert('Please enter a message');
            return;
        }
        
        // Log the bulk SMS
        const smsLogs = getSmsLogs();
        const newLog = {
            id: 'BULK-' + Date.now(),
            recipients: selectedOptions,
            message: message,
            date: new Date().toISOString(),
            status: 'simulated'
        };
        
        smsLogs.push(newLog);
        saveSmsLogs(smsLogs);
        
        alert(`Bulk SMS simulated to ${selectedOptions.length} group(s). In a real app, this would be sent to actual farmers.`);
        bulkSmsModal.style.display = 'none';
    });
}

// Utility function to generate IDs
function generateId(prefix) {
    return prefix + '-' + Math.random().toString(36).substr(2, 8);
}
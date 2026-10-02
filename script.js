const filterCategory = document.getElementById("filter-category");
// Get HTML elements
const form = document.getElementById("transaction-form");

const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transaction-list");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");


// Load transactions from Local Storage
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// Edit transaction ID
let editId = null;


// Add / Update Transaction
form.addEventListener("submit", function (event) {

    event.preventDefault();

    const type = typeInput.value;
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;


    // If editing
    if (editId !== null) {

        const transaction = transactions.find(
            item => item.id === editId
        );

        transaction.type = type;
        transaction.amount = amount;
        transaction.category = category;
        transaction.date = date;

        editId = null;

        document.querySelector("button[type='submit']").textContent =
            "➕ Add Transaction";

    }

    // If adding new transaction
    else {

        const transaction = {

            id: Date.now(),

            type: type,

            amount: amount,

            category: category,

            date: date

        };

        transactions.push(transaction);

    }


    // Save data
    saveTransactions();


    // Update display
    displayTransactions();

    updateSummary();


    // Reset form
    form.reset();

});


// Save transactions
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Display Transactions
function displayTransactions() {

    transactionList.innerHTML = "";


    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                No transactions added yet.
            </p>
        `;

        return;

    }


    transactions.forEach(function (transaction) {

        const div = document.createElement("div");

        div.classList.add("transaction-item");


        div.innerHTML = `

            <div class="transaction-info">

                <h4>${transaction.category}</h4>

                <p>
                    ${transaction.date} |
                    ${transaction.type}
                </p>

            </div>


            <div class="transaction-amount">

                ${transaction.type === "income" ? "+" : "-"}
                ₹${transaction.amount.toLocaleString("en-IN")}

            </div>


            <div class="transaction-actions">

                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    🗑️ Delete
                </button>

            </div>

        `;


        transactionList.appendChild(div);

    });

}


// Edit Transaction
function editTransaction(id) {

    const transaction = transactions.find(
        item => item.id === id
    );


    if (!transaction) {
        return;
    }


    // Put data into form
    typeInput.value = transaction.type;

    amountInput.value = transaction.amount;

    categoryInput.value = transaction.category;

    dateInput.value = transaction.date;


    // Store ID
    editId = id;


    // Change button text
    document.querySelector("button[type='submit']").textContent =
        "💾 Update Transaction";


    // Scroll to form
    document.querySelector(".transaction-form").scrollIntoView({
        behavior: "smooth"
    });

}


// Delete Transaction
function deleteTransaction(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this transaction?");


    if (!confirmDelete) {
        return;
    }


    transactions = transactions.filter(
        item => item.id !== id
    );


    saveTransactions();

    displayTransactions();

    updateSummary();

}


// Update Summary
function updateSummary() {

    let income = 0;

    let expense = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        }

        else {

            expense += transaction.amount;

        }

    });


    const currentBalance = income - expense;


    totalIncome.textContent =
        "₹" + income.toLocaleString("en-IN");


    totalExpense.textContent =
        "₹" + expense.toLocaleString("en-IN");


    balance.textContent =
        "₹" + currentBalance.toLocaleString("en-IN");

}


// Initial display
displayTransactions();

updateSummary();
// Category Filter
filterCategory.addEventListener("change", function () {

    const selectedCategory = filterCategory.value;

    const filteredTransactions =
        selectedCategory === "all"
            ? transactions
            : transactions.filter(function (transaction) {
                return transaction.category === selectedCategory;
            });

    displayFilteredTransactions(filteredTransactions);
});


// Display Filtered Transactions
function displayFilteredTransactions(filteredTransactions) {

    transactionList.innerHTML = "";

    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                No transactions found.
            </p>
        `;

        return;
    }


    filteredTransactions.forEach(function (transaction) {

        const div = document.createElement("div");

        div.classList.add("transaction-item");

        div.innerHTML = `

            <div class="transaction-info">

                <h4>${transaction.category}</h4>

                <p>
                    ${transaction.date} |
                    ${transaction.type}
                </p>

            </div>


            <div class="transaction-amount">

                ${transaction.type === "income" ? "+" : "-"}
                ₹${transaction.amount.toLocaleString("en-IN")}

            </div>


            <div class="transaction-actions">

                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    🗑️ Delete
                </button>

            </div>

        `;

        transactionList.appendChild(div);

    });

}
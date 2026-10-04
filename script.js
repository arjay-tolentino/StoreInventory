let products =
    JSON.parse(localStorage.getItem("products")) || [];

let history =
    JSON.parse(localStorage.getItem("stockHistory")) || [];


// MIGRATE OLD PRODUCTS
products = products.map(product => {

    if (
        product.purchasePrice === undefined ||
        product.retailPrice === undefined
    ) {

        return {
            id: product.id || "",
            name: product.name || "",
            category: product.category || "",
            purchasePrice: Number(product.price) || 0,
            retailPrice: Number(product.price) || 0,
            stock: Number(product.stock) || 0
        };

    }

    return product;

});

saveProducts();

displayProducts();
updateDashboard();
updateCategoryFilter();
displayHistory();


function addProduct() {

    const productId =
        document.getElementById("productId").value.trim();

    const productName =
        document.getElementById("productName").value.trim();

    const category =
        document.getElementById("category").value.trim();

    const purchasePrice =
        document.getElementById("purchasePrice").value;

    const retailPrice =
        document.getElementById("retailPrice").value;

    const stock =
        document.getElementById("stock").value;


    if (
        productId === "" ||
        productName === "" ||
        category === "" ||
        purchasePrice === "" ||
        retailPrice === "" ||
        stock === ""
    ) {

        alert("Please fill in all fields.");

        return;
    }


    const existingProduct = products.find(
        product => product.id === productId
    );


    if (existingProduct) {

        alert("Product ID already exists.");

        return;
    }


    if (
        Number(purchasePrice) <= 0 ||
        Number(retailPrice) <= 0 ||
        Number(stock) < 0 ||
        !Number.isInteger(Number(stock))
    ) {

        alert(
            "Purchase price and retail price must be greater than 0. Stock must be a whole number and cannot be negative."
        );

        return;
    }


    const product = {

        id: productId,

        name: productName,

        category: category,

        purchasePrice: Number(purchasePrice),

        retailPrice: Number(retailPrice),

        stock: Number(stock)

    };


    products.push(product);

    products.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, {
            numeric: true,
            sensitivity: "base"
        })
    );

    saveProducts();

    displayProducts();

    updateDashboard();

    updateCategoryFilter();


    document.getElementById("productId").value = "";

    document.getElementById("productName").value = "";

    document.getElementById("category").value = "";

    document.getElementById("purchasePrice").value = "";

    document.getElementById("retailPrice").value = "";

    document.getElementById("stock").value = "";
}


function filterCategory() {

    const selectedCategory =
        document.getElementById("categoryFilter").value;

    const table =
        document.getElementById("inventoryTable");

    table.innerHTML = "";


    products.forEach((product, index) => {

        if (
            selectedCategory === "all" ||
            product.category === selectedCategory
        ) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${product.id}</td>

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td>
                    ₱${Number(product.purchasePrice).toFixed(2)}
                </td>

                <td>
                    ₱${Number(product.retailPrice).toFixed(2)}
                </td>

                <td>${product.stock}</td>

                <td>

                    <button
                        class="stock-in-btn"
                        onclick="stockIn(${index})">
                        + Stock In
                    </button>

                    <button
                        class="stock-out-btn"
                        onclick="stockOut(${index})">
                        - Stock Out
                    </button>

                    <button
                        class="edit-btn"
                        onclick="editProduct(${index})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${index})">
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        }

    });

}


function displayProducts() {

    const table =
        document.getElementById("inventoryTable");

    table.innerHTML = "";


    if (products.length === 0) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td colspan="7" class="empty-state">
                No products found.
            </td>
        `;


        table.appendChild(row);

        return;
    }


    products.forEach((product, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${product.id || ""}</td>

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>
                ₱${Number(product.purchasePrice).toFixed(2)}
            </td>

            <td>
                ₱${Number(product.retailPrice).toFixed(2)}
            </td>

            <td>${product.stock}</td>

            <td>

                <button
                    class="stock-in-btn"
                    onclick="stockIn(${index})">
                    + Stock In
                </button>

                <button
                    class="stock-out-btn"
                    onclick="stockOut(${index})">
                    - Stock Out
                </button>

                <button
                    class="edit-btn"
                    onclick="editProduct(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteProduct(${index})">
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


function updateCategoryFilter() {

    const categoryFilter =
        document.getElementById("categoryFilter");


    if (!categoryFilter) {
        return;
    }


    const categories = [];


    products.forEach(product => {

        if (
            product.category &&
            !categories.includes(product.category)
        ) {

            categories.push(product.category);

        }

    });


    categoryFilter.innerHTML = "";


    const allOption =
        document.createElement("option");


    allOption.value = "all";

    allOption.textContent =
        "All Categories";


    categoryFilter.appendChild(allOption);


    categories.forEach(category => {

        const option =
            document.createElement("option");


        option.value = category;

        option.textContent = category;


        categoryFilter.appendChild(option);

    });

}


function deleteProduct(index) {

    const product =
        products[index];


    const confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            product.name +
            "?"
        );


    if (!confirmDelete) {
        return;
    }


    products.splice(index, 1);


    saveProducts();

    displayProducts();

    updateDashboard();

    updateCategoryFilter();

}


function stockIn(index) {

    const product =
        products[index];


    const amount =
        prompt(
            "How many stocks are you adding?",
            "1"
        );


    if (amount === null) {
        return;
    }


    const quantity =
        Number(amount);


    if (
        quantity <= 0 ||
        !Number.isInteger(quantity)
    ) {

        alert(
            "Please enter a valid whole number greater than 0."
        );

        return;
    }


    product.stock += quantity;


    history.push({

        date: new Date().toLocaleString(),

        id: product.id,

        name: product.name,

        action: "Stock In",

        quantity: quantity

    });


    localStorage.setItem(
        "stockHistory",
        JSON.stringify(history)
    );


    saveProducts();

    displayProducts();

    displayHistory();

    updateDashboard();

}


function stockOut(index) {

    const product =
        products[index];


    const amount =
        prompt(
            "How many stocks are being removed?",
            "1"
        );


    if (amount === null) {
        return;
    }


    const quantity =
        Number(amount);


    if (
        quantity <= 0 ||
        !Number.isInteger(quantity)
    ) {

        alert(
            "Please enter a valid whole number greater than 0."
        );

        return;
    }


    if (quantity > product.stock) {

        alert(
            "Not enough stock available."
        );

        return;
    }


    product.stock -= quantity;


    history.push({

        date: new Date().toLocaleString(),

        id: product.id,

        name: product.name,

        action: "Stock Out",

        quantity: quantity

    });


    localStorage.setItem(
        "stockHistory",
        JSON.stringify(history)
    );


    saveProducts();

    displayProducts();

    displayHistory();

    updateDashboard();

}


function updateDashboard() {

    const totalProducts =
        products.length;


    const totalStock =
        products.reduce(
            (total, product) =>
                total + Number(product.stock || 0),
            0
        );


    const inventoryValue =
        products.reduce(
            (total, product) =>
                total +
                (
                    Number(product.purchasePrice || 0) *
                    Number(product.stock || 0)
                ),
            0
        );


    const totalTransactions =
        history.length;


    document.getElementById("totalProducts")
        .textContent =
        totalProducts;


    document.getElementById("totalStock")
        .textContent =
        totalStock;


    document.getElementById("inventoryValue")
        .textContent =
        "₱" +
        inventoryValue.toFixed(2);


    document.getElementById("totalTransactions")
        .textContent =
        totalTransactions;

}


function searchProduct() {

    const search =
        document.getElementById("searchProduct")
            .value
            .toLowerCase()
            .trim();


    const table =
        document.getElementById("inventoryTable");


    table.innerHTML = "";


    products.forEach((product, index) => {

        const productId =
            String(product.id || "")
                .toLowerCase();


        const productName =
            String(product.name || "")
                .toLowerCase();


        const category =
            String(product.category || "")
                .toLowerCase();


        if (
            productId.includes(search) ||
            productName.includes(search) ||
            category.includes(search)
        ) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${product.id || ""}</td>

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td>
                    ₱${Number(product.purchasePrice).toFixed(2)}
                </td>

                <td>
                    ₱${Number(product.retailPrice).toFixed(2)}
                </td>

                <td>${product.stock}</td>

                <td>

                    <button
                        class="stock-in-btn"
                        onclick="stockIn(${index})">
                        + Stock In
                    </button>

                    <button
                        class="stock-out-btn"
                        onclick="stockOut(${index})">
                        - Stock Out
                    </button>

                    <button
                        class="edit-btn"
                        onclick="editProduct(${index})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${index})">
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        }

    });

}


function editProduct(index) {

    const product =
        products[index];


    const newId =
        prompt(
            "Enter new product ID:",
            product.id || ""
        );


    if (
        newId === null ||
        newId.trim() === ""
    ) {

        return;
    }

    const duplicateId = products.find(
        (product, productIndex) =>
            product.id === newId.trim() &&
            productIndex !== index
    );

    if (duplicateId) {
        alert("Product ID already exists.");
        return;
    }

    const newName =
        prompt(
            "Enter new product name:",
            product.name
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {

        return;
    }


    const newCategory =
        prompt(
            "Enter new category:",
            product.category
        );


    if (
        newCategory === null ||
        newCategory.trim() === ""
    ) {

        return;
    }


    const newPurchasePrice =
        prompt(
            "Enter purchase price:",
            product.purchasePrice
        );


    if (
        newPurchasePrice === null ||
        newPurchasePrice === ""
    ) {

        return;
    }


    const newRetailPrice =
        prompt(
            "Enter retail price:",
            product.retailPrice
        );


    if (
        newRetailPrice === null ||
        newRetailPrice === ""
    ) {

        return;
    }


    const newStock =
        prompt(
            "Enter new stock:",
            product.stock
        );


    if (
        newStock === null ||
        newStock === ""
    ) {

        return;
    }


    if (
        Number(newPurchasePrice) <= 0 ||
        Number(newRetailPrice) <= 0 ||
        Number(newStock) < 0 ||
        !Number.isInteger(Number(newStock))
    ) {

        alert(
            "Purchase price and retail price must be greater than 0. Stock must be a whole number and cannot be negative."
        );

        return;
    }


    product.id =
        newId.trim();


    product.name =
        newName.trim();


    product.category =
        newCategory.trim();


    product.purchasePrice =
        Number(newPurchasePrice);


    product.retailPrice =
        Number(newRetailPrice);


    product.stock =
        Number(newStock);


    products.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, {
            numeric: true,
            sensitivity: "base"
        })
    );


    saveProducts();

    displayProducts();

    updateDashboard();

    updateCategoryFilter();

}


function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}


function displayHistory() {

    const table =
        document.getElementById("historyTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (history.length === 0) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td colspan="5" class="empty-state">
                No stock history found.
            </td>
        `;

        table.appendChild(row);

        return;
    }

    history.forEach(record => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${record.date}</td>

            <td>${record.id}</td>

            <td>${record.name}</td>

            <td class="${record.action === "Stock In"
                ? "history-in"
                : "history-out"
            }">

                ${record.action}

            </td>

            <td>${record.quantity}</td>

        `;

        table.appendChild(row);

    });

}


function clearHistory() {

    if (history.length === 0) {

        alert(
            "There is no stock history to clear."
        );

        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear all stock history?"
        );


    if (!confirmClear) {
        return;
    }


    history = [];


    localStorage.removeItem(
        "stockHistory"
    );


    displayHistory();

}
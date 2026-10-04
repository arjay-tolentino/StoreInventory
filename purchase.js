let products = JSON.parse(localStorage.getItem("products")) || [];
let purchaseList = JSON.parse(localStorage.getItem("purchaseList")) || [];

purchaseList = purchaseList.map(item => {
    if (item.purchasePrice === undefined) {
        return {
            id: item.id || "",
            name: item.name || "",
            purchasePrice: Number(item.price) || 0,
            quantity: Number(item.quantity) || 0,
            purchaseDate: item.purchaseDate || ""
        };
    }
    return item;
});

function savePurchaseList() {
    localStorage.setItem("purchaseList", JSON.stringify(purchaseList));
}

function loadProducts() {
    const select = document.getElementById("purchaseProduct");

    select.innerHTML = '<option value="">-- Select Product --</option>';

    products.forEach((product, index) => {
        const option = document.createElement("option");

        option.value = index;
        option.textContent =
            product.name + " - ₱" +
            Number(product.purchasePrice || 0).toFixed(2);

        select.appendChild(option);
    });
}

function searchPurchaseProduct() {

    const searchInput =
        document.getElementById("purchaseSearch");

    const select =
        document.getElementById("purchaseProduct");

    if (!searchInput || !select) {
        return;
    }

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    select.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent =
        search === ""
            ? "-- Select Product --"
            : "-- Select Search Result --";

    select.appendChild(defaultOption);

    products.forEach((product, index) => {

        const productId =
            String(product.id || "")
                .toLowerCase();

        const productName =
            String(product.name || "")
                .toLowerCase();

        if (
            search === "" ||
            productId.includes(search) ||
            productName.includes(search)
        ) {

            const option =
                document.createElement("option");

            option.value = index;

            option.textContent =
                product.id +
                " - " +
                product.name +
                " - ₱" +
                Number(product.purchasePrice || 0)
                    .toFixed(2);

            select.appendChild(option);
        }
    });
}

function addPurchase() {
    const productSelect = document.getElementById("purchaseProduct");
    const quantityInput = document.getElementById("purchaseQuantity");
    const purchaseDate = document.getElementById("purchaseDate").value;

    if (productSelect.value === "") {
        alert("Please select a product.");
        return;
    }

    const quantity = Number(quantityInput.value);

    if (quantity <= 0 || !Number.isInteger(quantity)) {
        alert("Please enter a valid whole number.");
        return;
    }

    if (purchaseDate === "") {
        alert("Please select a purchase date.");
        return;
    }

    const product = products[Number(productSelect.value)];

    const existingItem = purchaseList.find(
        item => item.id === product.id
    );

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.purchaseDate = purchaseDate;
        existingItem.purchasePrice =
            Number(product.purchasePrice || 0);
    } else {
        purchaseList.push({
            id: product.id,
            name: product.name,
            purchasePrice: Number(product.purchasePrice || 0),
            quantity: quantity,
            purchaseDate: purchaseDate
        });
    }

    savePurchaseList();
    displayPurchaseList();

    productSelect.value = "";
    quantityInput.value = "";
}

function displayPurchaseList() {
    const table = document.getElementById("purchaseTable");

    table.innerHTML = "";

    if (purchaseList.length === 0) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="5" class="empty-state">
                No products added to purchase list.
            </td>
        `;

        table.appendChild(row);

        document.getElementById("purchaseItemCount").textContent = 0;
        document.getElementById("purchaseQuantityTotal").textContent = 0;
        document.getElementById("purchaseTotal").textContent = "₱0.00";

        return;
    }

    document.getElementById("purchaseItemCount").textContent =
        purchaseList.length;

    let total = 0;
    let totalQuantity = 0;

    purchaseList.forEach((item, index) => {
        const purchasePrice = Number(item.purchasePrice || 0);
        const quantity = Number(item.quantity || 0);
        const subtotal = purchasePrice * quantity;

        total += subtotal;
        totalQuantity += quantity;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${quantity}</td>
            <td>₱${purchasePrice.toFixed(2)}</td>
            <td>₱${subtotal.toFixed(2)}</td>
            <td class="no-print">
                <button class="edit-btn" onclick="editPurchase(${index})">
                    Edit
                </button>
                <button class="delete-btn" onclick="removePurchase(${index})">
                    Remove
                </button>
            </td>
        `;

        table.appendChild(row);
    });

    document.getElementById("purchaseTotal").textContent =
        "₱" + total.toFixed(2);

    document.getElementById("purchaseQuantityTotal").textContent =
        totalQuantity;
}

function removePurchase(index) {
    const item = purchaseList[index];

    const confirmRemove = confirm(
        "Are you sure you want to remove " +
        item.name +
        " from the purchase list?"
    );

    if (!confirmRemove) {
        return;
    }

    purchaseList.splice(index, 1);

    savePurchaseList();
    displayPurchaseList();
}

function clearPurchaseList() {
    if (purchaseList.length === 0) {
        alert("Purchase list is already empty.");
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to clear the entire purchase list?"
    );

    if (!confirmClear) {
        return;
    }

    purchaseList = [];

    savePurchaseList();
    displayPurchaseList();
}

function editPurchase(index) {
    const item = purchaseList[index];

    const newQuantity = prompt(
        "Edit quantity for " +
        item.name +
        "\nCurrent quantity: " +
        item.quantity +
        "\n\nEnter new quantity:",
        item.quantity
    );

    if (newQuantity === null) {
        return;
    }

    const quantity = Number(newQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
        alert("Please enter a valid whole number greater than 0.");
        return;
    }

    item.quantity = quantity;

    savePurchaseList();
    displayPurchaseList();
}

function printPurchaseList() {
    if (purchaseList.length === 0) {
        alert("Purchase list is empty.");
        return;
    }

    setPrintDate();
    window.print();
}

function setPrintDate() {
    const date = new Date().toLocaleDateString();

    document.getElementById("printDate").textContent = date;
}

function setDefaultPurchaseDate() {
    const dateInput = document.getElementById("purchaseDate");

    const today = new Date().toISOString().split("T")[0];

    dateInput.value = today;
}

savePurchaseList();
loadProducts();
displayPurchaseList();
setDefaultPurchaseDate();
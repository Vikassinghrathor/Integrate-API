document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'https://crudcrud.com/api/eec9848f21424e42876bd513ff4bd9d8/products';

  const productInventory = [];

  const storedData = localStorage.getItem('productInventory');
  if (storedData) {
    productInventory.push(...JSON.parse(storedData));
  }

  async function renderProductList() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    let totalWorth = 0;

    productInventory.forEach((product, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${product.productName} - $${product.price} 
        <button class="delete-button" data-index="${index}">Delete</button>`;
      productList.appendChild(listItem);

      totalWorth += product.price;
    });

    const totalWorthElement = document.getElementById('totalWorth');
    totalWorthElement.textContent = totalWorth;

    const deleteButtons = document.getElementsByClassName('delete-button');
    for (const deleteButton of deleteButtons) {
      deleteButton.addEventListener('click', deleteProduct);
    }
  }

  async function addProduct() {
    const priceInput = document.getElementById('priceInput');
    const productInput = document.getElementById('productInput');

    const price = parseFloat(priceInput.value);
    const productName = productInput.value;

    if (isNaN(price) || productName.trim() === '') {
      alert('Please fill in both fields with valid data.');
      return;
    }

    const newProduct = {
      productName: productName,
      price: price,
    };

    try {
      const response = await axios.post(apiUrl, newProduct);
      productInventory.push(response.data);
      renderProductList();
      priceInput.value = '';
      productInput.value = '';

      localStorage.setItem('productInventory', JSON.stringify(productInventory));
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }

  async function deleteProduct() {
    const index = this.getAttribute('data-index');
    const product = productInventory[index];
    const productId = product._id; 

    try {
      await axios.delete(`${apiUrl}/${productId}`);
      productInventory.splice(index, 1);
      renderProductList();

      localStorage.setItem('productInventory', JSON.stringify(productInventory));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  const addProductButton = document.getElementById('addProductButton');
  addProductButton.addEventListener('click', addProduct);

  renderProductList();
});

document.addEventListener('DOMContentLoaded', function () {
  // Define the API URL for making PUT requests
  const apiUrl = 'https://crudcrud.com/api/51a5395121904c208513f2f87b2d1947/orders';

  // Store the order details
  const orders = {
    'Table1': [],
    'Table2': [],
    'Table3': [],
  };


  // function loadDataFromServer() {
  //   axios.get(apiUrl)
  //     .then(response => {
  //       if (response.data) {
          
  //         for (const table in response.data) {
  //           orders[table] = response.data[table];
  //         }
          
  //         for (const table in orders) {
  //           updateOrdersTable(table);
  //         }
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error loading data from the server:', error);
  //     });
  // }

  
  // loadDataFromServer();

  
  function addToBill() {
    const price = document.getElementById('priceInput').value;
    const dish = document.getElementById('dishInput').value;
    const tableSelect = document.getElementById('tableSelect');
    const table = tableSelect.value;

    if (price && dish && table) {
      const order = { price, dish };
      orders[table].push(order);
      updateOrdersTable(table);
      clearInputFields();

      // Update the order data on the server
      updateOrderDataOnServer();
    } else {
      alert('Please fill in all fields.');
    }
  }

  // Function to update the orders for a specific table
  function updateOrdersTable(table) {
    const tableElement = document.getElementById(table);
    const ordersList = orders[table];

    let tableHTML = `<h4>${table}</h4>`;
    for (let i = 0; i < ordersList.length; i++) {
      const order = ordersList[i];
      tableHTML += `<p>${order.dish} - $${order.price} <button class="delete-button" data-table="${table}" data-index="${i}">Delete</button></p>`;
    }

    tableElement.innerHTML = tableHTML;

    // Add event listeners to the delete buttons
    const deleteButtons = tableElement.getElementsByClassName('delete-button');
    for (const deleteButton of deleteButtons) {
      deleteButton.addEventListener('click', deleteOrder);
    }
  }


// Function to delete an order
function deleteOrder() {
  const table = this.getAttribute('data-table');
  const index = this.getAttribute('data-index');

  orders[table].splice(index, 1);
  updateOrdersTable(table);

  // Update the order data on the server
  updateOrderDataOnServer();
  deleteOrderDataOnServer(table, userId); // Pass userId as an argument
}


  // Function to clear input fields
  function clearInputFields() {
    document.getElementById('priceInput').value = '';
    document.getElementById('dishInput').value = '';
  }

 // Function to update the order data on the server
function updateOrderDataOnServer() {
  
  axios.post(apiUrl, orders)
    .then(response => {
      console.log('Order data updated on the server:', response.data);
    })
    .catch(error => {
      if (error.response) {
        console.error('Error updating order data on the server:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
    });
}
function deleteOrderDataOnServer(table,userId) {
  const deleteUrl = `${apiUrl}/${table}/${userId}`;

  axios.delete(deleteUrl)
    .then(response => {
      console.log('Order data deleted on the server:', response.data);
    })
    .catch(error => {
      if (error.response) {
        console.error('Error deleting order data on the server:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the delete request:', error.message);
      }
    });
}

// function updateOrderDataOnServer() {
//   axios.put(apiUrl, orders)
//     .then(response => {
//       console.log('Order data updated on the server:', response.data);
//     })
//     .catch(error => {
//       console.error('Error updating order data on the server:', error);
//     });
// }




  document.getElementById('addToBillButton').addEventListener('click', addToBill);
});

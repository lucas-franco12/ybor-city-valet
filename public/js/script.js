//Add Customer Function
function addCustomer() {
    let customer = {
        lastName: document.getElementById("lastname").value,
        number: document.getElementById("number").value,
        time: document.getElementById("time").value,
        additionalInfo: document.getElementById("additional-info").value,
    };
  
    if(!validateCustomer(customer)) {
      console.log("Not adding customer");
      return;
    }
  
    fetch('/.netlify/functions/add-customer', {

        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(customer),
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.getElementById("lastname").value = "";
        document.getElementById("number").value = "";
        document.getElementById("time").value = "";
        document.getElementById("additional-info").value = "";
    })
    .catch(err => {
        console.log(err);
    });
  
  }

//    checks validity of phone number
//   function isValidPhoneNumber(phoneNumber) {
//     const phoneRegex = /^\d{10}$/;  
//     return phoneRegex.test(phoneNumber);
//   }
  
  //Validate Customer Function
  function validateCustomer(customer) {
    let isValidInput = true;
  
    if (customer.lastName == "") {
      alert("Please enter your last name.")
      isValidInput = false;
      return isValidInput;
    }
  
    if (customer.number == "") {
      alert("Please enter your phone number.")
      isValidInput = false;
      return isValidInput;
    }
    // else if (!isValidPhoneNumber(customer.number)) {
    //     alert("The phone number you entered is not valid.");
    //     isValidInput = false;
    //     return isValidInput;
    // }
  
    if (customer.time == "") {
      alert("Please enter your estimated arrival time.")
      isValidInput = false;
      return isValidInput;
    }
  
    return isValidInput;
  }

  // fetches data from the server and calls addCustomerToTable to 
  // display them
  async function fetchAndDisplayCustomers() {
        try {
          const response = await fetch('/.netlify/functions/get-customers');
          const customers = await response.json();

            customers.forEach((customer, index) => {
                addCustomerToTable(customer, index);
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    }
  
  //delete customer from the database
  async function deleteCustomer(index) {
      try {
        const response = await fetch('/.netlify/functions/get-customers');
        const customers = await response.json();

        if (index >=0 && index < customers.length) {
          const customerToDelete = customers[index];

          const deleteResponse = await fetch(`/.netlify/functions/delete-customer?id=${customerToDelete._id}`, {
            method: 'DELETE',
          });

          if (deleteResponse.status === 200) {
            console.log('Customer successfully deleted.');
          } else {
            console.log('Error deleting customer.')
          }

        }
      } catch (err) {
        console.log(err);
      }
    }
  
  
  //Adds and deletes customers from the table
  function addCustomerToTable(customer, index) {
    if (!customer || !customer.lastName || !customer.number || !customer.time) {
      return;
    }
      
    let table = document.getElementById("customer-table");
    let row = table.insertRow(-1);
    let cell = {};
    
    cell = row.insertCell(0);
    cell.textContent = customer.lastName;
    cell = row.insertCell(1);
    cell.textContent = customer.number;
    cell = row.insertCell(2);
    cell.textContent = customer.time;
    cell = row.insertCell(3);
    cell.textContent = customer.additionalInfo;
  
    cell = row.insertCell(4);
    let deleteButton = document.createElement("button"); 
    deleteButton.textContent = "\u00D7"; 
    deleteButton.className = "delete-button";
    deleteButton.onclick = function() {
      deleteCustomer(index);
      row.parentNode.removeChild(row);
    }
    cell.appendChild(deleteButton);
  }

  
  //Login 
  function verifyUser() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    let user = users.find(user => user.storedUsername === username);
  
    if(user && user.storedPassword === password){
      window.location.href = "table.html";
    } else {
      alert("Incorrect username or password.")
    }
    
  }
  
  function addNewUser(){
    let user = {};
    user.storedUsername = document.getElementById("new-username").value;
    user.storedPassword = document.getElementById("new-password").value;
  
    // user registration validation
    if (!user.storedUsername || !user.storedPassword) {
      alert('Please fill all the fields.');
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // check if username already exists
    let userExists = users.find(existingUser => existingUser.storedUsername === user.storedUsername);
    
    if (userExists) {
      alert('This username already exists. Please try another one.');
      return;
    }
  
    users.push(user);
  
    localStorage.setItem("users", JSON.stringify(users));
  
    document.getElementById("new-username").value = "";
    document.getElementById("new-password").value = "";
  }
  
  // Login/Signup Toggle
  
  
  let loginSection = document.getElementById("login-card");
  let signupSection = document.getElementById("signup-card");
  let toggleLoginBtn = document.getElementById("login-toggle");
  let toggleSignupBtn = document.getElementById("signup-toggle");
  let title = document.getElementById("title");
  
  toggleSignupBtn.addEventListener('click', function() {
    title.innerHTML = "Sign Up";
    loginSection.style.display = 'none';
    signupSection.style.display = 'flex';
    toggleLoginBtn.classList.add('disabled');
    toggleSignupBtn.classList.remove('disabled');
  });
  
  toggleLoginBtn.addEventListener('click', function() {
    title.innerHTML = "Login";
    loginSection.style.display = 'flex';
    signupSection.style.display = 'none';
    toggleLoginBtn.classList.remove('disabled');
    toggleSignupBtn.classList.add('disabled');
  });
  
  
  
  
  
  
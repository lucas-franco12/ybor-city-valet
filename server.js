const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4000;

// Mongodb Connection
const URI = 'mongodb+srv://lukefranc3:GpLNEIcVmd2Dq9rk@cluster0.t8g9zok.mongodb.net/?retryWrites=true&w=majority';

async function connect(){
    try {
        await mongoose.connect(URI)
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}

connect();

// Schema Definition
const Customer = mongoose.model('Customer', {
    lastName: String,
    number: String,
    time: String,
    additionalInfo: String,
});

// Middleware
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json()); 


//Route to add a customer
app.post('/add-customer', (req, res) => {
    const newCustomer = new Customer({
        lastName: req.body.lastName,
        number: req.body.number,
        time: req.body.time,
        additionalInfo: req.body.additionalInfo,
    });

    newCustomer.save()
        .then(savedCustomer => {
            res.json(savedCustomer);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error adding customer' });
        });
});

// Route to get all customers
app.get('/get-customers', async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers' });
    }
});

// route to delete customer by id
app.delete('/delete-customer/:id', async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (deletedCustomer) {
            res.status(200).json({message: 'Customer successfully deleted' });
        } else {
            res.status(404).json({message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({message: 'Error deleting customer' });
    }
})

// default route to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/table', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'table.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

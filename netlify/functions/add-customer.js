const mongoose = require('mongoose');
const Customer = mongoose.model('Customer', {
    lastName: String,
    number: String,
    time: String,
    additionalInfo: String,
});

exports.handler = async (event, context) => {
    await mongoose.connect(process.env.MONGODB_URI);

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);
    const newCustomer = new Customer(data);

    try {
        const savedCustomer = await newCustomer.save();
        return { statusCode: 200, body: JSON.stringify(savedCustomer) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Error adding customer' }) };
    }
};

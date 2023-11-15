const mongoose = require('mongoose');
const Customer = mongoose.model('Customer', {
    lastName: String,
    number: String,
    time: String,
    additionalInfo: String,
});

exports.handler = async (event, context) => {
    await mongoose.connect(process.env.MONGODB_URI);

    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const customers = await Customer.find({});
        return { statusCode: 200, body: JSON.stringify(customers) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Error fetching customers' }) };
    }
};

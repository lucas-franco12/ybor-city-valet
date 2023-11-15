const mongoose = require('mongoose');
const Customer = mongoose.model('Customer', {
    lastName: String,
    number: String,
    time: String,
    additionalInfo: String,
});

exports.handler = async (event, context) => {
    await mongoose.connect(process.env.MONGODB_URI);

    if (event.httpMethod !== 'DELETE') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { id } = event.queryStringParameters;

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return { statusCode: 404, body: 'Customer not found' };
        }
        return { statusCode: 200, body: 'Customer successfully deleted' };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Error deleting customer' }) };
    }
};

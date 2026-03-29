import axios from 'axios';

async function testValidation() {
    try {
        const response = await axios.post('http://localhost:3000/auth/register', {
            email: "not-an-email",
            password: "123",
            fullName: "T",
            phone: "123"
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.log('Status:', error.response?.status);
        console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

testValidation();

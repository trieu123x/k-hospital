import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
  try {
    const form = new FormData();
    form.append('fullName', 'Test User');
    form.append('email', 'test@example.com');
    form.append('phone', '0312345678');
    form.append('avatar', Buffer.from('fake image content'), {
      filename: 'fake.png',
      contentType: 'image/png'
    });

    const config = {
      headers: {
        ...form.getHeaders()
      }
    };

    console.log('Sending patch request to users...');
    const response = await axios.patch('http://localhost:5000/users/b7ffe429-8df6-4904-9c44-0527b5100e5d', form, config);
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      fs.writeFileSync('error.json', JSON.stringify(error.response.data, null, 2));
      console.log('Error saved to error.json');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testUpload();

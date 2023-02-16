const fs = require('fs');
const pdf = require('dynamic-html-pdf');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', '..', 'resources\\', 'testing.html'), 'utf8');

const options = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm',
};

const users = [
  {
    name: 'aaa',
    age: 24,
    dob: '1/1/1991',
  },
  {
    name: 'bbb',
    age: 25,
    dob: '1/1/1995',
  },
  {
    name: 'ccc',
    age: 24,
    dob: '1/1/1994',
  },
];

const testing = () => {
  const document = {
    type: 'file', // 'file' or 'buffer'
    template: html,
    context: {
      users,
    },
    path: path.join(__dirname, '..', '..', 'resources\\', `${Date.now()}.pdf`), // it is not required if type is buffer
  };
  pdf.create(document, options)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  testing,
};

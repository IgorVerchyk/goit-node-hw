// contacts.js

const fsPromises = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

//i used "async await" for avoid "callback hell"

//this function is for reading data from file
async function readData() {
  const contacts = await fsPromises.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
}

//reusable search used in different methods
function reusableSearchById(contacts, contactId) {
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact ? contact : false;
}

//this function is for reading data from file and to show it in table
function listContacts() {
  readData().then((data) => console.table(data));
}

//... for to get data from array by id
function getContactById(contactId) {
  readData()
    .then((contacts) => reusableSearchById(contacts, contactId))
    .then((data) => (data ? data : `there is no contact with this id`))
    .then((data) => console.log(data));
}

//...for removing data from array by id
function removeContact(contactId) {
  readData().then((contacts) => {
    const answer = reusableSearchById(contacts, contactId);
    if (!answer) {
      console.log("there is no contact with this id");
      return;
    }
    const clearedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );

    const newContacts = JSON.stringify(clearedContacts, null, 2);

    fsPromises.writeFile(contactsPath, newContacts, "utf-8");
    console.log(` contact successfuly removed`);
  });
}

//...for add new contact data into array
function addContact(name, email, phone) {
  const id = uuidv4();
  const contact = {
    id,
    name,
    email,
    phone,
  };

  readData().then((contacts) => {
    const newContacts = [...contacts, contact];
    const stringifyContacts = JSON.stringify(newContacts, null, 2);

    fsPromises
      .writeFile(contactsPath, stringifyContacts, "utf-8")
      .catch((error) => console.log(error.message));

    console.log(`${name} contact added`);
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

const { v4: uuid } = require("uuid");

const db = require("../db/index");

class ContactsRepository {
  parseId(id) {
    //this kostyli needed because lowdb library methods must be able to work with int value of id:key in default contacts.json
    return id.length < 2 ? parseInt(id) : id;
  }
  getAll() {
    return db.get("contacts").value();
  }
  getById(id) {
    const parsedId = this.parseId(id);
    console.log(parsedId);
    return db.get("contacts").find({ id: parsedId }).value();
  }
  create(body) {
    const id = uuid();
    const record = {
      id,
      ...body,
    };
    db.get("contacts").push(record).write();
    return record;
  }
  update(id, body) {
    const parsedId = this.parseId(id);
    const record = db
      .get("contacts")
      .find({ id: parsedId })
      .assign(body)
      .value();
    db.write();
    return record.id ? record : null;
  }
  remove(id) {
    const parsedId = this.parseId(id);
    const [record] = db.get("contacts").remove({ id: parsedId }).write();
    return record;
  }
}

module.exports = ContactsRepository;

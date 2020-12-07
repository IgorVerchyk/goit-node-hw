const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Contact name is required"],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, "Contact email is required"],
    minlength: 10,
  },
  phone: { type: String, required: [true, "Contact phone number is required"] },
  subscription: Schema.Types.Mixed,
  password: Schema.Types.Mixed,
  token: Schema.Types.Mixed,
});

contactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;

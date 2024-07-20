const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
// const { minLength } = require("validator");

const LabelsSchema = new mongoose.Schema({
  firstRow: {
    type: Array,
    required: [true, "Please enter first row shapes"],
    minLength: [1, "Please enter first row shapes"],
  },
  middleRow: {
    type: Array,
    required: [true, "Please enter middle row shapes"],
    minLength: [1, "Please enter middle row shapes"],
  },
  lastRow: {
    type: Array,
    required: [true, "Please enter last row shapes"],
    minLength: [1, "Please enter last row shapes"],
  },
  artNo: {
    type: String,
    required: [true, "Please enter art No"],
    unique: true,
  },
  barcode: {
    type: String,
    required: [true, "Please enter barcode"],
    unique: true,
  },
  reference: {
    type: String,
    required: [true, "Please enter reference"],
  },
  user: {
    type: Object,
    required: [true, "Please enter login user"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

LabelsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("labels", LabelsSchema);

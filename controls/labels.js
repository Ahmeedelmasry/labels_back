const LabelsSchema = require("../models/labels");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Creation Validator
const validatCreation = (error, body) => {
  const errors = {};
  let mainMsg = null;

  if (error.code == 11000 && error.keyValue.artNo) {
    errors.artNo = "Art no already exists";
    mainMsg = `Label ${error.index + 1} Art code already exists in our system`;
  }

  if (error.code == 11000 && error.keyValue.barcode) {
    errors.barcode = "barcode already exists";
    mainMsg = `Label ${error.index + 1} barcode already exists in our system`;
  }
  for (const val of Object.entries(error.errors ? error.errors : body)) {
    if (error.errors && error.errors[val[0]]) {
      if (!mainMsg) mainMsg = error.errors[val[0]].message;
      errors[val[0]] = error.errors[val[0]].message;
    }
  }

  return {
    errors: errors,
    message: mainMsg,
  };
};

const createLabel = async (req, res) => {
  const body = req.body;
  const savedArray = [];
  let invalid;
  let invalidMsg;
  try {
    for (let i = 0; i < body.labels.length; i++) {
      body.labels.map((el, index) => {
        // Check if labels have same barcode
        if (el.barcode == body.labels[i].barcode && index != i) {
          invalid = true;
          invalidMsg = `Label No ${
            index + 1
          } has the same barcode of label no ${i + 1}`;
        }

        // Check if labels have same art no
        if (el.artNo == body.labels[i].artNo && index != i) {
          invalid = true;
          invalidMsg = `Label No ${index + 1} has the same art no of label no ${
            i + 1
          }`;
        }
      });

      // Check if barcode exists in db
      const findDatabaseBarcode = await LabelsSchema.findOne({
        barcode: body.labels[i].barcode,
      });

      if (findDatabaseBarcode) {
        invalid = true;
        invalidMsg = `Label No ${
          i + 1
        } has a barcode that is used before in our system`;
      }

      // Check if art no exists in db
      const findDatabaseArtNo = await LabelsSchema.findOne({
        artNo: body.labels[i].artNo,
      });

      if (findDatabaseArtNo) {
        invalid = true;
        invalidMsg = `Label No ${
          i + 1
        } has an art no that is used before in our system`;
      }
    }

    if (invalid) {
      return res.status(400).json({ message: invalidMsg });
    }

    for (let i = 0; i < body.labels.length; i++) {
      const set = await LabelsSchema.create({
        ...body.labels[i],
        firstRow: body.firstRow,
        middleRow: body.middleRow,
        lastRow: body.lastRow,
        user: body.user,
        reference: body.reference.trim(),
      });
      const savedData = await set.save();
      savedArray.push(savedData);
    }

    return res
      .status(200)
      .json({ message: "Lables Created Successfully", data: savedArray });
  } catch (error) {
    const errors = validatCreation(error, body);
    res.status(400).json({ errors: errors.errors, message: errors.message });
  }
};

const updateLabel = async (req, res) => {
  try {
    let label = await LabelsSchema.findOne({ _id: req.params.id });
    //Hash The Password
    if (!label) {
      return res.status(404).json({ message: "Label not found" });
    }
    const body = {
      ...req.body,
    };

    await LabelsSchema.updateOne({ _id: req.params.id }, body);

    return res.status(200).json({
      message: "Label updated successfully",
    });
  } catch (error) {
    const errors = validatCreation(error, req.body);
    res.status(400).json({ errors: errors.errors, message: errors.message });
  }
};

const deleteLabel = async (req, res) => {
  const reference = req.query.reference;
  try {
    if (reference) {
      await LabelsSchema.deleteMany({ reference: reference });
      res.status(200).json({ message: "Label Deleted Successfully" });
    } else {
      await LabelsSchema.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Label Deleted Successfully" });
    }
  } catch (error) {
    res.status(404).json({ message: "Label not found" });
  }
};

const getLabel = async (req, res) => {
  try {
    const result = await LabelsSchema.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Label not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: "Label not found" });
  }
};

const getLabels = async (req, res) => {
  try {
    let query = {
      reference: req.query.reference,
    };

    const { searchWord, page = 1, limit = 10 } = req.query;

    if (searchWord) {
      query = {
        reference: req.query.reference,
        $or: [
          { artNo: { $regex: searchWord.trim(), $options: "i" } },
          { barcode: { $regex: searchWord.trim(), $options: "i" } },
        ],
      };
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 },
    };

    const result = await LabelsSchema.paginate(query, options);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

const getLabelsRefernces = async (req, res) => {
  try {
    let query = {};

    const { searchWord } = req.query;

    if (searchWord) {
      query = {
        $or: [{ reference: { $regex: searchWord.trim(), $options: "i" } }],
      };
    }
    const result = await LabelsSchema.find(query);

    const finalResult = [];
    result.forEach((el) => {
      if (!finalResult.find((element) => element == el.reference)) {
        finalResult.push(el.reference);
      }
    });

    res.status(200).json(finalResult);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports = {
  createLabel,
  getLabel,
  getLabels,
  updateLabel,
  deleteLabel,
  getLabelsRefernces,
};

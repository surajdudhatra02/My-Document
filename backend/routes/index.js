var express = require("express");
const userModel = require("../models/userModel");
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var docModel = require("../models/docModel");

const secret = "secret";

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", async (req, res) => {
  let { username, name, email, phone, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  let phoneCon = await userModel.findOne({ phone: phone });

  if (emailCon) {
    return res.json({ success: false, message: "email already exist" });
  } else if (phoneCon) {
    return res.json({ success: false, message: "Phone number already exist" });
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) throw err;
        let user = await userModel.create({
          username: username,
          name: name,
          email: email,
          phone: phone,
          password: hash,
        });
        res.json({ success: true, message: "User Created successfully", userId: user._id });
      });
    });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        var token = jwt.sign({ email: user.email, userId: user._id }, secret);
        res.json({ success: true, message: "Login Successful", userId: user._id, token: token })
      } else {
        res.json({ success: false, message: "Invalid Password" })
      }
    });
  } else {
    res.json({ success: false, message: "Invalid email" })
  }
})

router.post("/createdoc", async (req, res) => {
  let { userId, docName } = req.body;
  let user = userModel.findById(userId);
  if (user) {
    let doc = await docModel.create({
      uploadedBy: userId,
      title: docName
    })

    return res.json({ success: true, message: "Document created successfully", docId: doc._id });
  }
  else {
    return res.json({ success: false, message: "Invalid User" })
  }
})

router.post("/uploaddoc", async (req, res) => {
  let { userId, docId, content } = req.body;
  let user = userModel.findById(userId);
  if (user) {
    let doc = await docModel.findByIdAndUpdate(docId, { content: content });
    return res.json({ success: true, message: "Document updated successfully" })
  }
  else {
    return res.json({ success: false, message: "Invalid user" })
  }
})

router.post("/getdoc", async (req, res) => {
  let { docId, userId } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    let doc = await docModel.findById(docId);
    if (doc) {
      return res.json({ success: true, message: "Document fetched successfully", doc: doc });
    }
    else {
      return res.json({ success: false, message: "Invalid document" })
    }
  }
  else {
    return res.json({ success: false, message: "Invalid user" })
  }
});

router.post("/deletedoc", async (req, res) => {
  let { userId, docId } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    let doc = await docModel.findByIdAndDelete(docId);
    return res.json({ success: true, message: "Document deleted successsfully" });
  }
  else {
    return res.json({ success: false, message: "Invalid user" })
  }
})


router.post("/getalldocs", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    let docs = await docModel.find({ uploadedBy: userId });
    return res.json({ success: true, message: "Documents fetched successfully", docs: docs });
  }
  else {
    return res.json({ success: false, message: "Invalid user" })
  }
});

router.post("getuser", async (req, res) => {
  let { userId } = req.body;
  let user = userModel.findById(userId);
  if (user) {
    return res.json({ success: false, message: "Invalid user" })
  }
})


router.post("/logout", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    return res.json({ success: true, message: "User logged out successfully" });
  }
  else {
    return res.json({ success: false, message: "Invalid user" })
  }
})

module.exports = router;

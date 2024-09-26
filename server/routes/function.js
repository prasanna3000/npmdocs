const { v4 } = require("uuid");
const functionDoc = require("../models/function");
const express = require("express");
const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { functions, package } = req.body;
    if(functions.length > 100) {
      return res.status(400).json({
        success: false,
        err: 'Too long request',
      });
    }

    const functionPromises = functions.map(async (func) => {
      const newDoc = new functionDoc({
        functionId: v4(),
        functionName: func.functionName,
        package,
        documentation: func.documentation,
      });
      return await newDoc.save();
    });

    const savedFunctions = await Promise.all(functionPromises);

 
    console.log(
      `Function documentations for ${package} saved successfully.`
    );

    return res.status(200).json({
      success: true,
      data: savedFunctions,
    });
  } catch (err) {
    console.error("Error saving package:", err.message);
    return res.status(400).json({
      success: false,
      err,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { packageId, searchString, page = 0, limit = 10 } = req.query;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        err: "packageId is required",
      });
    }

    let query = { package: packageId };

    if (searchString) {
      query.$or = [
        { functionName: { $regex: searchString, $options: "i" } },
        { documentation: { $regex: searchString, $options: "i" } },
      ];
    }

    const skip = (page) * limit;
    const functions = await functionDoc
      .find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const totalFunctions = await functionDoc.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: functions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalFunctions / limit),
        totalFunctions,
      },
    });
  } catch (err) {
    console.error("Error fetching functions:", err.message);
    return res.status(500).json({
      success: false,
      err: err.message,
    });
  }
});


module.exports = router;

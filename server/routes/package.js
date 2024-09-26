const express = require("express");
const { v4 } = require("uuid");
const { downloadPackage, getPackageVersions } = require("./task");
const Package = require("../models/package");

const router = express.Router();
router.post("/save", async (req, res) => {
  const {
    name, ownerId
  } = req.body;
  try {
    const versions = Object.keys(await getPackageVersions(name));

    const packagePromises = versions.map(async (version) => {
      const newPackage = new Package({
        packageId: v4(),
        name,
        version,
        owner: ownerId,
      });

      return await newPackage.save();
    });

    const savedPackages = await Promise.all(packagePromises);

    await downloadPackage(name, versions);
    console.log(`Package ${name} saved successfully.`);
    return res.status(200).json({
      success: true,
      data: savedPackages
    });
  } catch (err) {
    console.error("Error saving package:", err);
    return res.status(400).json({
      success: false,
      err,
    });
  }
});

module.exports = router;

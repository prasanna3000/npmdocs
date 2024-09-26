const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { execSync } = require("child_process");
const tar = require("tar");

const router = express.Router();
const targetPath = "packages";

const getPackageVersions = async (packageName) => {
  try {
    const response = await axios.get(
      `https://registry.npmjs.org/${packageName}`
    );
    return response.data.versions;
  } catch (error) {
    console.error("Error fetching package versions:", error);
    return [];
  }
};

const downloadAndGenerateDocs = (packageName, version = "latest") => {
  const basePath = path.resolve(__dirname, `../packages`);

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const tarballName = execSync(`npm pack ${packageName}@${version}`, { cwd: basePath }).toString().trim();
  const tarballPath = path.resolve(basePath, tarballName);
  console.log('****** tarballPath *********', tarballPath)

  const extractPath = path.join(basePath, `package`);

  tar.x({ file: tarballPath, cwd: basePath, sync: true });
  fs.renameSync(extractPath, `${extractPath}-${version}`);
  fs.unlinkSync(tarballPath);
};

const downloadPackage = async (packageName, versions = []) => {
  let versionsToDownload = versions;
  if (versionsToDownload.length === 0) {
    versionsToDownload = Object.keys(await getPackageVersions(packageName));
  }
  if (versionsToDownload.length === 0) return false;
  const folderPath = path.resolve(targetPath);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const finalVersionsToDownload = [versionsToDownload[versionsToDownload.length-1]];

  finalVersionsToDownload.forEach((version) =>
    downloadAndGenerateDocs(packageName, version)
  );
};

router.post("/save", async (req, res) => {
  const { package, versions } = req.body;
  console.log(
    "Received request for the package",
    package,
    "and versions: ",
    versions
  );

  const response = await downloadPackage(package, versions);

  return res.status(200).json({
    success: true,
    status: response,
  });
});

module.exports = { router, downloadPackage, getPackageVersions };

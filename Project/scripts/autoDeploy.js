const { execSync } = require("child_process");

try {
  console.log("🚀 Starting automation...\n");

  console.log("📦 Adding files...");
  execSync("git add .", { stdio: "inherit" });

  console.log("📝 Creating commit...");
  execSync(`git commit -m "Auto commit: ${new Date().toLocaleString()}"`, {
    stdio: "inherit",
  });

  console.log("📤 Pushing to GitHub...");
  execSync("git push", { stdio: "inherit" });

  console.log("🏗 Running build...");
  execSync("npm run build", { stdio: "inherit" });

  console.log("✅ Automation Complete!");
} catch (error) {
  console.error("❌ Error during automation:", error.message);
}

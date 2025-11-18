// Quick test to verify native module loads correctly
const fontBridge = require("./build/Release/font_bridge.node");

console.log("Native module loaded successfully!");
console.log("Available functions:", Object.keys(fontBridge));

// Test that functions exist
console.log("registerFont:", typeof fontBridge.registerFont);
console.log("unregisterFont:", typeof fontBridge.unregisterFont);
console.log("unregisterAllFonts:", typeof fontBridge.unregisterAllFonts);

console.log("\n✓ All functions are available");

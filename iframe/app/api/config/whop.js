const { WhopServerSdk } = require("@whop/api")

// Validate environment variables
const requiredEnvVars = {
  WHOP_API_KEY: process.env.WHOP_API_KEY,
  NEXT_PUBLIC_WHOP_APP_ID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error("Missing required Whop environment variables:", missingVars)
  throw new Error(`Missing Whop configuration: ${missingVars.join(", ")}`)
}

console.log("Initializing Whop SDK with:", {
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  hasApiKey: !!process.env.WHOP_API_KEY,
  companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "not set",
  onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID || "not set",
})

const whopSdk = WhopServerSdk({
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  appApiKey: process.env.WHOP_API_KEY,
  onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID, // optional
  companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID, // optional
})

// Test the SDK connection
const testWhopConnection = async () => {
  try {
    // Try to make a simple API call to test the connection
    console.log("Testing Whop SDK connection...")
    // You can add a simple test call here if needed
    console.log("Whop SDK initialized successfully")
  } catch (error) {
    console.error("Whop SDK connection test failed:", error)
  }
}

testWhopConnection()

module.exports = whopSdk

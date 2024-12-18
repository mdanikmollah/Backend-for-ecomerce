import { configDotenv } from "dotenv"

configDotenv()

const serverPort = process.env.PORT || 8000
const dbUrl = process.env.DATABASE_URL
const cloud_name = process.env.cloud_name
const api_key = process.env.api_key
const api_secret = process.env.api_secret
export { serverPort, dbUrl, cloud_name, api_key, api_secret }
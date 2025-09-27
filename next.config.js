/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  turbopack: {
    root: "C:\\Users\\Bunny\\Desktop\\BUNNY PROJECTS\\JAL Projects\\jal-booking-event",
  },
}

module.exports = nextConfig

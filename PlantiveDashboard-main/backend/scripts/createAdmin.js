const mongoose = require("mongoose")
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') })

const User = require("../models/User")
const Role = require("../models/Role")

mongoose.connect(process.env.MONGODB_URI)

async function createAdmin() {
    try {
        // Initialize roles to ensure they exist in DB
        await Role.initializeRoles()
        
        // Find district_officer role
        const adminRole = await Role.findOne({ name: 'district_officer' })
        if (!adminRole) {
            console.error("District officer role could not be found or created.")
            process.exit(1)
        }

        const existingAdmin = await User.findOne({ email: "admin@plantive.com" })
        if (existingAdmin) {
            console.log("Admin already exists")
            process.exit(0)
        }

        // Pass plain password since the User schema hashes it on save
        const admin = new User({
            name: "Admin",
            email: "admin@plantive.com",
            password: "admin123",
            role: adminRole._id
        })

        await admin.save()

        console.log("Admin created successfully")
        process.exit(0)
    } catch (error) {
        console.error("Error creating admin:", error)
        process.exit(1)
    }
}

createAdmin()
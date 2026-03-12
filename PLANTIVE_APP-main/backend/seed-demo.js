const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('./models/Role');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
const Official = require('./models/Official');
const Plot = require('./models/Plot');
const Submission = require('./models/Submission');

dotenv.config();

const seed = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/plantive-dash';
        await mongoose.connect(uri);
        console.log('MongoDB Connected to:', uri);

        // Cleanup existing demo data
        await User.deleteMany({ email: { $in: ['farmer@demo.com', 'officer@demo.com'] } });
        await Farmer.deleteMany({ 'contact.phone': '8888888888' });
        await Official.deleteMany({ designation: 'Demo District Officer' });
        // Cleanup based on ID is harder without fetching, so we'll just delete all plots and submissions for simplicity in demo
        // Better: we'll fetch the farmer ID later and delete their plots.

        // 1. Seed roles
        await Role.initializeRoles();
        const farmerRole = await Role.findOne({ name: 'farmer' });
        const officerRole = await Role.findOne({ name: 'district_officer' });

        if (!farmerRole || !officerRole) {
            throw new Error('Roles not initialized properly');
        }

        // 2. Create Demo Officer User
        const officerUser = await User.create({
            name: 'Rajesh Kumar',
            email: 'officer@demo.com',
            password: 'password123',
            phone: '9999999999',
            role: officerRole._id,
            isActive: true
        });

        // 3. Create Demo Official Profile
        const officialProfile = await Official.create({
            userId: officerUser._id,
            department: 'Agriculture Department',
            designation: 'Demo District Officer',
            employeeId: 'OFF-2024-001',
            assignedDistricts: ['Nashik', 'Pune'],
            assignedStates: ['Maharashtra'],
            isAvailable: true,
            specialization: ['crops', 'general']
        });

        // 4. Create Demo Farmer User
        const farmerUser = await User.create({
            name: 'Maya Devi',
            email: 'farmer@demo.com',
            password: 'password123',
            phone: '8888888888',
            role: farmerRole._id,
            isActive: true
        });

        // 5. Create Demo Farmer Profile
        const farmerProfile = await Farmer.create({
            name: 'Maya Devi',
            location: {
                address: 'House 42, Bairagarh Village',
                coordinates: [77.3477, 23.2333], // [long, lat] - near Bhopal
                region: 'Central India',
                district: 'Bhopal',
                village: 'Bairagarh'
            },
            contact: {
                phone: '8888888888',
                email: 'farmer@demo.com'
            },
            identification: {
                idType: 'national_id',
                idNumber: 'PMFBY2024000001'
            },
            registeredBy: officerUser._id,
            status: 'active'
        });

        // 6. Create Demo Plot
        const demoPlot = await Plot.create({
            farmer: farmerProfile._id,
            plotId: `PLOT-DEMO-001`,
            name: 'Main Wheat Field',
            coordinates: {
                type: 'Polygon',
                coordinates: [[[77.3470, 23.2330], [77.3485, 23.2330], [77.3485, 23.2340], [77.3470, 23.2340], [77.3470, 23.2330]]]
            },
            centerPoint: [77.3477, 23.2335],
            area: {
                value: 5.2,
                unit: 'hectares'
            },
            cropType: 'Wheat',
            cropVariety: 'Sharbati',
            plantingDate: new Date('2023-11-15'),
            healthStatus: 'good',
            healthScore: 85,
            status: 'active'
        });

        // Update farmer with plot reference
        farmerProfile.plots.push(demoPlot._id);
        farmerProfile.totalArea = 5.2;
        await farmerProfile.save();

        // 7. Create a Demo Submission
        await Submission.create({
            farmer: farmerProfile._id,
            plot: demoPlot._id,
            submittedBy: farmerUser._id,
            submissionType: 'routine_inspection',
            description: 'Weekly crop health check. Wheat is growing well.',
            location: {
                coordinates: [77.3477, 23.2335],
                accuracy: 5,
                capturedAt: new Date()
            },
            data: {
                pestObserved: false,
                diseaseObserved: false,
                weatherConditions: 'Sunny',
                notes: 'No issues found during inspection.'
            },
            status: 'pending',
            priority: 'normal'
        });

        console.log('-----------------------------------');
        console.log('Comprehensive Demo Data Seeded:');
        console.log('Officer: Rajesh Kumar (officer@demo.com)');
        console.log('Farmer: Maya Devi (8888888888)');
        console.log('Entity Records: Official, Farmer, Plot, Submission created.');
        console.log('-----------------------------------');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Field ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seed();

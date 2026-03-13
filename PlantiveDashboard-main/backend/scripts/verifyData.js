const mongoose = require('mongoose');
require('dotenv').config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Role = mongoose.model('Role', new mongoose.Schema({ name: String }));
        const User = mongoose.model('User', new mongoose.Schema({ role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' } }));
        const Farmer = mongoose.model('Farmer', new mongoose.Schema({}));
        const Plot = mongoose.model('Plot', new mongoose.Schema({ district: String, area: { value: Number } }));
        const Submission = mongoose.model('Submission', new mongoose.Schema({ submissionType: String, status: String }));
        const Official = mongoose.model('Official', new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }));

        const roles = await Role.find({ name: { $in: ['agriofficer', 'district_officer'] } });
        const roleIds = roles.map(r => r._id);

        const farmers = await Farmer.countDocuments();
        const submissions = await Submission.countDocuments();
        const plots = await Plot.find({}, 'area.value');
        const totalArea = plots.reduce((sum, p) => sum + (p.area?.value || 0), 0);
        const officers = await User.countDocuments({ role: { $in: roleIds } });
        const officials = await Official.countDocuments();

        console.log('\n--- Database Stats ---');
        console.log(`Farmers: ${farmers}`);
        console.log(`Submissions: ${submissions}`);
        console.log(`Total Area: ${totalArea.toFixed(1)}`);
        console.log(`Officers (Users): ${officers}`);
        console.log(`Officials (Models): ${officials}`);

        console.log('\n--- Recent Activity Check ---');
        const recent = await Submission.find().sort({ createdAt: -1 }).limit(5);
        console.log(`Found ${recent.length} recent submissions`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Verification failed:', err);
        process.exit(1);
    }
};

verify();

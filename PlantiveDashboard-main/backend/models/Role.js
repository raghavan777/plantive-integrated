const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        unique: true,
        trim: true,
        enum: ['district_officer']
    },
    permissions: [{
        type: String,
        enum: [
            'users:read', 'users:write', 'users:delete',
            'farmers:read', 'farmers:write', 'farmers:delete',
            'plots:read', 'plots:write', 'plots:delete',
            'submissions:read', 'submissions:write', 'submissions:verify',
            'images:read', 'images:write', 'images:delete',
            'reports:read', 'reports:write', 'reports:export',
            'ai:analyze', 'ai:read',
            'notifications:read', 'notifications:write',
            'settings:read', 'settings:write'
        ]
    }],
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Static method to initialize default roles
roleSchema.statics.initializeRoles = async function () {
    const defaultRoles = [
        {
            name: 'district_officer',
            permissions: [
                'users:read', 'users:write', 'users:delete',
                'farmers:read', 'farmers:write', 'farmers:delete',
                'plots:read', 'plots:write', 'plots:delete',
                'submissions:read', 'submissions:write', 'submissions:verify',
                'images:read', 'images:write', 'images:delete',
                'reports:read', 'reports:write', 'reports:export',
                'ai:analyze', 'ai:read',
                'notifications:read', 'notifications:write',
                'settings:read', 'settings:write'
            ],
            description: 'District Officer Access (Full System Access)'
        }
    ];

    for (const role of defaultRoles) {
        await this.findOneAndUpdate(
            { name: role.name },
            role,
            { upsert: true, new: true }
        );
    }
};

module.exports = mongoose.model('Role', roleSchema);
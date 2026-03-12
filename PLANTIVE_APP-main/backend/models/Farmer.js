const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Farmer name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere',
            validate: {
                validator: function (val) {
                    return val.length === 2;
                },
                message: 'Coordinates must be [longitude, latitude]'
            }
        },
        region: String,
        district: String,
        village: String
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        emergencyContact: {
            name: String,
            phone: String,
            relation: String
        }
    },
    identification: {
        idType: {
            type: String,
            enum: ['national_id', 'passport', 'drivers_license', 'other']
        },
        idNumber: String,
        documents: [{
            type: String, // URLs to uploaded documents
            trim: true
        }]
    },
    plots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plot'
    }],
    totalArea: {
        type: Number,
        default: 0 // in hectares
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    registeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Index for geospatial queries
farmerSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for plot count
farmerSchema.virtual('plotCount').get(function () {
    return this.plots ? this.plots.length : 0;
});

module.exports = mongoose.model('Farmer', farmerSchema);
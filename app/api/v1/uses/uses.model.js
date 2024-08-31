import { Schema, model, models } from 'mongoose';

const usesSchema = new Schema(
    {
        use: {
            type: Number,
            trim: true,
            default: 0,
            required: [true, 'Use number is required.'],
            description: 'The use number of the module.',
        },
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

const UsesModel = models.Uses || model('Uses', usesSchema);

export default UsesModel;

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// It executes "pre" before save a record on MongoDB.
userSchema.pre('save', async function(next){
    // This comprobation is important because if we use the same schema to perform other actions, this "pre" function is going to execute again and take the hash password, making another hash over this. So we need to check if password has changed, if not we go forward.
    if(!this.isModified('password')){
        next();
    }

    // Generating the salt for hashing passwords
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Adding a method for checking passwords
// passwordForm: Password send by user through the form
userSchema.methods.isPasswordValid = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model('User',userSchema);

export default User;
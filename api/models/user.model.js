const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fopenart.ai%2Fdiscovery%2Fsd-1007264747206475826&psig=AOvVaw1T8G6K8NMJCv2ZReuHyXMs&ust=1705939818357000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMCm6Z3v7oMDFQAAAAAdAAAAABAD"
        },
    }
    , { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

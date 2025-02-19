import axios from "axios";

const deleteFromCloudinary = async (publicId) => {
    try {
        await axios.post(
            "https://api.cloudinary.com/v1_1/your_cloud_name/delete_by_token",
            {
                public_id: publicId,
                api_key: "458648294995764",
                api_secret: "4sJMKaN3QmfdbKW0-2AKnycSw9c"
            }
        );
        console.log(`Deleted file: ${publicId}`);
    } catch (error) {
        console.error(`Failed to delete ${publicId}:`, error);
    }
};

export default deleteFromCloudinary;
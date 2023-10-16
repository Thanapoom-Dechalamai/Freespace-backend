const fs = require('fs');

const methods = {
    async onGetAllAvatars(req, res)
    {
        try
        {
            const publicFolderPath = 'public/images';
            const files = await fs.promises.readdir(publicFolderPath);
            const images = files.filter((file) => file.endsWith('.jpg') || file.endsWith('.png'));
            const imageUrls = images.map((image) => `${process.env.API_ENDPOINT}/images/` + image);

            return res.status(200).json({
                status: 200,
                result: imageUrls
            });
        } catch (error)
        {
            return res.status(500).json({
                status: 500,
                message: error.message
            });
        }

    }
};

module.exports = methods;
const Link = require("../models/urlModel")
const shortid = require("shortid");


module.exports.createUrl = async (req, res) => {
    const { destinationUrl, remarks, expirationDate } = req.body;
    console.log(req.body)


    if (!destinationUrl) {
        return res.status(400).json({
            status: 'error',
            message: "Destination URL is required."
        });
    }

    try {
        // Generate a unique short URL
        const shortUrl = shortid.generate();

        // Create and save the link
        const newLink = new Link({
            destinationUrl,
            shortUrl,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            userId: req.user._id,
            remarks
        });

        await newLink.save();

        return res.status(201).json({
            status: 'success',
            message: "Short URL created successfully.",
            data: {
                destinationUrl: newLink.destinationUrl,
                shortUrl: `${req.headers.host}/${newLink.shortUrl}`,
                expirationDate: newLink.expirationDate,
                userId: newLink.userId,
            },
        });
    } catch (err) {
        console.error("Error creating short URL:", err);
        res.status(500).json({
            status: 'error',
            message: "Server error. Please try again later."
        });
    }
}

module.exports.editUrl = async (req, res) => {
    const { id } = req.params; // ID of the link to be updated
    const { destinationUrl, remarks, expirationDate } = req.body;

    if (!destinationUrl && !remarks && !expirationDate) {
        return res.status(400).json({
            status: 'error',
            message: "At least one field is required for update.",
        });
    }

    try {

        const link = await Link.findOne({ _id: id, userId: req.user.id });

        if (!link) {
            return res.status(404).json({
                status: 'error',
                message: "Link not found or you do not have permission to edit this link.",
            });
        }

        // Update fields only if they are provided
        if (destinationUrl) link.destinationUrl = destinationUrl;
        if (remarks) link.remarks = remarks; // Assumes a `remarks` field exists in the schema
        if (expirationDate) link.expirationDate = new Date(expirationDate);
        // Save the updated link
        await link.save();

        return res.status(200).json({
            status: 'success',
            message: "Link updated successfully.",
            data: {
                id: link._id,
                originalUrl: link.originalUrl,
                remarks: link.remarks,
                expirationDate: link.expirationDate,
                shortUrl: link.shortUrl,
            },
        });
    } catch (err) {
        console.error("Error updating link:", err);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while updating the link. Please try again later.",
        });
    }
}
module.exports.deleteUrl = async (req, res) => {
    const { id } = req.params;

    try {
        const link = await Link.findOne({ _id: id, userId: req.user.id });

        if (!link) {
            return res.status(404).json({
                status: 'error',
                message: "Link not found or you do not have permission to delete this link.",
            });
        }

        await Link.deleteOne({ _id: id });

        return res.status(200).json({
            status: 'success',
            message: "Link deleted successfully.",
            data: {
                id: link._id,
                originalUrl: link.originalUrl,
                shortUrl: link.shortUrl,
            },
        });
    } catch (err) {
        console.error("Error deleting link:", err);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while deleting the link. Please try again later.",
        });
    }
}
module.exports.getAllUrls = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const urls = await Link.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalLinks = await Link.countDocuments({ userId: req.user.id });

        return res.status(200).json({
            message: "Links fetched successfully.",
            data: {
                urls,
                pagination: {
                    totalLinks,
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalLinks / limit),
                },
            },
        });
    } catch (err) {
        console.error("Error fetching links:", err);
        return res.status(500).json({
            error: "An error occurred while fetching the links. Please try again later.",
        });
    }
}

module.exports.redirectToOriginalUrl = async (req, res) => {
    const { shortUrl } = req.params;
    console.log("Received short URL:", shortUrl); 
    try {
        const link = await Link.findOne({ shortUrl });
        console.log("Found link:", link);
        if (!link) {
            return res.status(404).json({
                status: 'error',
                message: "Short URL not found.",
            });
        }

        if (link.expirationDate && new Date() > link.expirationDate) {
            return res.status(410).json({
                status: 'error',
                message: "This link has expired.",
            });
        }

        const clickMetadata = {
            timestamp: new Date(),
            ipAddress: req.ip, 
            userAgent: req.headers['user-agent'],
        };

        link.clicks += 1;
        link.analytics.push(clickMetadata);
        await link.save();
        console.log("Redirecting to:", link.destinationUrl);
        res.redirect(link.destinationUrl);

    } catch (err) {
        console.error("Error during redirect:", err);
        return res.status(500).json({
            status: 'error',
            message: "An error occurred while processing the request.",
            error: err.message,
        });
    }
};


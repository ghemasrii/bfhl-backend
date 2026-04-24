const {
    buildHierarchyResponse
} = require("../utils/hierarchyProcessor");

const processHierarchy = (req, res) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({
                error: "data must be an array"
            });
        }

        const result = buildHierarchyResponse(data);

        res.status(200).json({
            user_id: "gottumukkalahemasri_22122005",
            email_id: "hemasri_gottumukkala@srmap.edu.in",
            college_roll_number: "AP23110011197",
            ...result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
};

module.exports = {
    processHierarchy
};
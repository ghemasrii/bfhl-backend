const { buildHierarchyResponse } = require("../utils/hierarchyProcessor");

const processHierarchy = (req, res) => {
    try {
        console.log("REQUEST BODY:", req.body);

        const inputData = req.body.data;

        if (!inputData || !Array.isArray(inputData)) {
            return res.status(400).json({
                is_success: false,
                message: "Input must be an array inside data"
            });
        }

        const result = buildHierarchyResponse(inputData);

        return res.status(200).json({
            user_id: "gottumukkalahemasri_22122005",
            email_id: "hemasri_gottumukkala@srmap.edu.in",
            college_roll_number: "AP23110011197",
            ...result
        });

    } catch (error) {
        console.error("ERROR:", error);

        return res.status(500).json({
            is_success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    processHierarchy
};
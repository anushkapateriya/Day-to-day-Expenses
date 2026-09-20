const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const categorizeExpense = async (description) => {

    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `
        Categorize this expense into exactly ONE category.

        Allowed categories:
        Food
        Transport
        Entertainment
        Shopping
        Bills
        Health
        Education
        Income
        Other

        Expense description:
        ${description}

        Return ONLY the category name.
        `
    });

    return response.text.trim();
};

module.exports = {
    categorizeExpense
};


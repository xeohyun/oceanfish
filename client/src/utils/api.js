const API_BASE_URL = "http://localhost:8000/api";

export const getSunfish = async () => {
    const response = await fetch(`${API_BASE_URL}/sunfish`);
    return response.json();
};

export const postContribution = async (data) => {
    const response = await fetch(`${API_BASE_URL}/contribution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
};

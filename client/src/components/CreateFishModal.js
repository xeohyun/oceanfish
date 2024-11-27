/*
import React, { useState } from "react";
import "../css/CreateFishModal.css";

function CreateFishModal({ onClose, onCreate }) {
    const [name, setName] = useState("");

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/create-fish/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (response.ok) {
                onCreate(data.sunfish);
            } else {
                console.error("Error creating fish:", data.error);
            }
        } catch (error) {
            console.error("Error creating fish:", error);
        }
    };

    return (
        <div className="modal">
            <h2>Create New Fish</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter fish name"
            />
            <button onClick={handleSubmit}>Create</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default CreateFishModal;
*/

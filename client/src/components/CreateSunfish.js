/*
import React, { useState, useEffect } from "react";
import "../css/CreateSunfish.css";

function CreateSunfish() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [canCreate, setCanCreate] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
    const [createdSunfish, setCreatedSunfish] = useState(null); // 새로 생성된 Sunfish 정보

    // 기존 Sunfish 상태 확인
    useEffect(() => {
        const checkSunfishStatus = async () => {
            console.log("Fetching current Sunfish status...");
            try {
                const response = await fetch("http://127.0.0.1:8000/api/sunfish/");
                console.log("API Response Status:", response.status);
                if (!response.ok) {
                    throw new Error("Failed to fetch Sunfish status");
                }
                const data = await response.json();
                console.log("API Response Data:", data);

                // Sunfish 상태 확인
                const canCreateNew = data.length === 0 || data.every((sunfish) => {
                    const condition = !sunfish.is_alive || sunfish.level >= 50;
                    console.log(
                        `Checking Sunfish ${sunfish.name}: Can create condition = ${condition}`
                    );
                    return condition;
                });
                console.log("Final Can create new Sunfish:", canCreateNew);

                setCanCreate(canCreateNew);
                if (!canCreateNew) {
                    setError(
                        "You can only create a new Sunfish if all current ones are either dead or at level 50."
                    );
                }
            } catch (err) {
                console.error("Error checking Sunfish status:", err.message);
                setError("Unable to fetch Sunfish status.");
            }
        };

        checkSunfishStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/createsunfish/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Sunfish '${data.sunfish.name}' created successfully!`);
                setCreatedSunfish(data.sunfish); // 생성된 Sunfish 정보 저장
                setName(""); // 입력 초기화
                setCanCreate(false); // 새 Sunfish 생성 제한
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to create Sunfish");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    const closeModal = () => {
        setMessage("");
        setError("");
        setIsModalOpen(false); // 모달 닫기
    };

    return (
        <div className="create-sunfish-wrapper">
            {/!* 평소에 작은 버튼 *!/}
            {!isModalOpen && (
                <button
                    className="open-create-sunfish-btn"
                    onClick={() => {
                        setIsModalOpen(true);
                        if (!canCreate) {
                            setError(
                                "You can only create a new Sunfish if all current ones are either dead or at level 50."
                            );
                        }
                    }}
                >
                    Create New Sunfish
                </button>
            )}

            {/!* 모달 창 *!/}
            {isModalOpen && (
                <div className="create-sunfish-container">
                    <h2>Create a New Sunfish</h2>
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}
                    {canCreate ? (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Enter Sunfish Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button type="submit" disabled={!name.trim()}>
                                Create
                            </button>
                        </form>
                    ) : (
                        <p>Please resolve the above issue before creating a new Sunfish.</p>
                    )}
                    {message && <p className="success-message">{message}</p>}
                    {createdSunfish && (
                        <div className="created-sunfish-info">
                            <p>New Sunfish Details:</p>
                            <p>Name: {createdSunfish.name}</p>
                            <p>Level: {createdSunfish.level}</p>
                            <p>Status: {createdSunfish.is_alive ? "Alive" : "Dead"}</p>
                        </div>
                    )}
                    <button className="close-btn" onClick={closeModal}>
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default CreateSunfish;
*/

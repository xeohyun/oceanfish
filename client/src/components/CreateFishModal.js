import React, { useState } from 'react';
import '../css/CreateFishModal.css';

function CreateFishModal({ isVisible, onCreate, onClose }) {
    const [name, setName] = useState(''); // 입력된 이름을 저장

    if (!isVisible) {
        return null; // Modal이 보이지 않도록 설정
    }

    const handleCreate = () => {
        if (name.trim() === '') {
            alert('Please enter a name for your Sunfish.');
            return;
        }
        onCreate(name); // 부모 컴포넌트로 이름 전달
        setName(''); // 입력 필드 초기화
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create a New Sunfish</h2>
                <p>Your previous Sunfish has perished. Please create a new Sunfish to continue.</p>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter fish name"
                    className="name-input"
                />
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={handleCreate}>
                        Create
                    </button>
                    <button className="cancel-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateFishModal;

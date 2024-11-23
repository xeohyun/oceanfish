import React from 'react';

function UIBox({ className, title, content }) {
    return (
        <div className={`ui-box ${className}`}>
            {title}
            <br />
            {content}
        </div>
    );
}

export default UIBox;

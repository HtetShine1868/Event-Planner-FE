// components/ReviewModal.js
import React, { useState } from 'react';

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  type,
  itemName 
}) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (decision) => {
    onConfirm(decision, feedback);
    setFeedback('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <p>You are about to {type.toLowerCase()} <strong>{itemName}</strong>. Please provide feedback:</p>
          
          <div className="feedback-input">
            <label htmlFor="feedback">Feedback (Required)</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
              rows="4"
              required
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button 
            onClick={() => handleSubmit(type === 'Approve')} 
            className={type === 'Approve' ? 'btn-confirm-approve' : 'btn-confirm-reject'}
            disabled={!feedback.trim()}
          >
            {type} {type === 'Approve' ? '✓' : '✕'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
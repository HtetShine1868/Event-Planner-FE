import React, { useState } from 'react';

const DetailsModal = ({ 
  isOpen, 
  onClose, 
  type, 
  item, 
  onApprove, 
  onReject 
}) => {
  const [feedback, setFeedback] = useState('');
  
  if (!isOpen || !item) return null;

  const handleApprove = () => {
    onApprove(item.id, feedback);
    setFeedback('');
    onClose();
  };

  const handleReject = () => {
    onReject(item.id, feedback);
    setFeedback('');
    onClose();
  };
// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{type === 'event' ? 'Event Details' : 'Application Details'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {type === 'event' ? (
            <div className="event-details-content">
              <div className="detail-section">
                <h3>Event Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Title:</span>
                    <span className="detail-value">{item.title || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{item.category || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{item.description || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Event Date:</span>
                    <span className="detail-value">{formatDate(item.eventDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{item.location || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">{item.capacity || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ticket Price:</span>
                    <span className="detail-value">
                      {item.ticketPrice ? `$${item.ticketPrice}` : 'Free'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Organizer Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{item.organizer?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {item.organizer?.email ? (
                        <a href={`mailto:${item.organizer.email}`} className="email-link">
                          {item.organizer.email}
                        </a>
                      ) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Submission Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${item.status ? item.status.toLowerCase() : 'pending'}`}>
                      {item.status || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="application-details-content">
              <div className="detail-section">
                <h3>Applicant Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{item.applicantName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      <a href={`mailto:${item.applicantEmail}`} className="email-link">
                        {item.applicantEmail || 'N/A'}
                      </a>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Organization:</span>
                    <span className="detail-value">{item.organization || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Application Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Reason:</span>
                    <span className="detail-value">{item.reason || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">{item.experience || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{formatDateTime(item.submissionDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="status-badge pending">PENDING</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="feedback-section">
            <h3>Feedback (Optional)</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add feedback for the organizer/applicant..."
              className="feedback-textarea"
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <div className="action-buttons">
            <button className="btn-reject" onClick={handleReject}>
              Reject
            </button>
            <button className="btn-approve" onClick={handleApprove}>
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these CSS styles to your AdminDashboard.css file
/*
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
}

.modal-close:hover {
  color: #374151;
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  color: #1f2937;
}

.feedback-section {
  margin-top: 24px;
}

.feedback-section h3 {
  margin: 0 0 12px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.feedback-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
}

.feedback-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  padding: 8px 16px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-approve, .btn-reject {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover {
  background: #dc2626;
}

.email-link {
  color: #3b82f6;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}
*/

export default DetailsModal;
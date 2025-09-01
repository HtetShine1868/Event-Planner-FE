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
                    <span className="detail-value">{item.organizerName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      <a href={`mailto:${item.email}`} className="email-link">
                        {item.email || 'N/A'}
                      </a>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{item.userId || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Application Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Description/Reason:</span>
                    <span className="detail-value">{item.description || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">{formatDateTime(item.appliedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${item.status ? item.status.toLowerCase() : 'pending'}`}>
                      {item.status || 'PENDING'}
                    </span>
                  </div>
                  {item.feedback && (
                    <div className="detail-item">
                      <span className="detail-label">Previous Feedback:</span>
                      <span className="detail-value">{item.feedback}</span>
                    </div>
                  )}
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

export default DetailsModal;
import React from 'react';

export default function App() {
  return (
    <div style={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          color: '#1a1d29', 
          fontSize: '24px', 
          fontWeight: '600',
          margin: '0 0 16px 0'
        }}>
          Karenban - Clean Rebuild
        </h1>
        <p style={{ 
          color: '#64748b', 
          fontSize: '16px',
          margin: '0 0 24px 0'
        }}>
          Fresh start with clean architecture. Ready to build features incrementally.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <button style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>+</span>
            New Task
          </button>
          
          <button style={{
            backgroundColor: 'white',
            color: '#1a1d29',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            📋 Board
          </button>
          
          <button style={{
            backgroundColor: 'white',
            color: '#1a1d29',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            📅 This Week
          </button>
          
          <button style={{
            backgroundColor: 'white',
            color: '#1a1d29',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            🎯 Coach
          </button>
        </div>
        
        <div style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            color: '#1a1d29', 
            fontSize: '18px', 
            fontWeight: '600',
            margin: '0 0 12px 0'
          }}>
            Sample Task Card
          </h3>
          <p style={{ 
            color: '#64748b', 
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            This is how task cards will look in the final design.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <span style={{
              backgroundColor: '#f97316',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase'
            }}>
              Progress
            </span>
            <span style={{
              color: '#ef4444',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              🚩 Urgent
            </span>
            <span style={{
              color: '#64748b',
              fontSize: '12px'
            }}>
              🕐 30 min
            </span>
            <span style={{
              color: '#64748b',
              fontSize: '12px'
            }}>
              💬 2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export function FloatingBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large background blobs */}
      <div 
        className="absolute w-96 h-96 bg-mgmt-pink opacity-10 blob-shape"
        style={{ 
          top: '10%', 
          left: '-10%',
          animationDelay: '0s',
          animationDuration: '20s'
        }}
      />
      <div 
        className="absolute w-80 h-80 bg-mgmt-purple opacity-10 blob-shape-2"
        style={{ 
          top: '60%', 
          right: '-5%',
          animationDelay: '5s',
          animationDuration: '25s'
        }}
      />
      <div 
        className="absolute w-64 h-64 bg-mgmt-yellow opacity-10 blob-shape-3"
        style={{ 
          top: '30%', 
          left: '50%',
          animationDelay: '10s',
          animationDuration: '18s'
        }}
      />
      
      {/* Medium floating blobs */}
      <div 
        className="absolute w-32 h-32 bg-mgmt-green opacity-15 blob-shape"
        style={{ 
          top: '20%', 
          right: '20%',
          animationDelay: '2s',
          animationDuration: '15s'
        }}
      />
      <div 
        className="absolute w-24 h-24 bg-mgmt-lime opacity-15 blob-shape-2"
        style={{ 
          bottom: '20%', 
          left: '20%',
          animationDelay: '8s',
          animationDuration: '12s'
        }}
      />
      
      {/* Small accent blobs */}
      <div 
        className="absolute w-16 h-16 bg-mgmt-beige opacity-20 blob-shape-3"
        style={{ 
          top: '70%', 
          left: '10%',
          animationDelay: '3s',
          animationDuration: '10s'
        }}
      />
      <div 
        className="absolute w-12 h-12 bg-mgmt-sage opacity-20 blob-shape"
        style={{ 
          top: '40%', 
          right: '10%',
          animationDelay: '6s',
          animationDuration: '8s'
        }}
      />
    </div>
  );
}

// src/components/common/RoleAvatar.jsx
import React from "react";

const RoleAvatar = ({ role, size = 80 }) => {
  const avatars = {
    driver: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#e8f5ee"/>
        <path d="M40 20C35 20 30 25 30 30C30 35 35 40 40 40C45 40 50 35 50 30C50 25 45 20 40 20Z" fill="#2d6a4f"/>
        <path d="M25 55C25 45 35 40 40 40C45 40 55 45 55 55V60H25V55Z" fill="#2d6a4f"/>
        <circle cx="35" cy="30" r="3" fill="white"/>
        <circle cx="45" cy="30" r="3" fill="white"/>
      </svg>
    ),
    recruiter: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#e8f5ee"/>
        <rect x="25" y="25" width="30" height="30" rx="4" fill="#2d6a4f"/>
        <rect x="32" y="30" width="16" height="4" rx="2" fill="white"/>
        <rect x="32" y="38" width="16" height="4" rx="2" fill="white"/>
        <rect x="32" y="46" width="10" height="4" rx="2" fill="white"/>
      </svg>
    ),
    admin: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#e8f5ee"/>
        <path d="M40 20L20 30V40C20 55 30 65 40 70C50 65 60 55 60 40V30L40 20Z" fill="#2d6a4f"/>
        <path d="M40 45C44 45 48 41 48 37C48 33 44 29 40 29C36 29 32 33 32 37C32 41 36 45 40 45Z" fill="white"/>
        <path d="M35 48H45V52H35V48Z" fill="white"/>
      </svg>
    ),
  };

  return (
    <div className="w-20 h-20">
      {avatars[role] || avatars.driver}
    </div>
  );
};

export default RoleAvatar;
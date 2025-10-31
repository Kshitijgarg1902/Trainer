import React from 'react';

const ProfileItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-xl font-semibold text-gray-900">{value}</p>
  </div>
);

export default ProfileItem;

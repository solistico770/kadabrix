import { supabaseUrl } from "../../../../../kadabrix/kdbConfig";

import React from 'react';


function UserDetailsBar({ part }) {
  if (!part) return <div>לא הועבר חלק</div>;

  const imageUrl = `${supabaseUrl}/storage/v1/render/image/public/images/${part}.jpg?width=780&height=780&resize=contain`;

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>תמונה עבור: {part}</h3>
      <img
        src={imageUrl}
        alt={`תמונה עבור ${part}`}
        style={{
          maxWidth: '100%',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginTop: '12px',
        }}
      />
    </div>
  );
}

export default {
  priority:1,
  label: 'תמונה',
  barComponent: UserDetailsBar,
};

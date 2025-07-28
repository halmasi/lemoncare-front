import { motion } from 'framer-motion';
import { useState } from 'react';

export default function BooleanSwitch({
  toggle,
  isToggledOn = false,
}: {
  toggle: (b: boolean) => void;
  isToggledOn?: boolean;
}) {
  const [isOn, setIsOn] = useState(isToggledOn);

  return (
    <div className="flex gap-2">
      <label>آدرس پیشفرض</label>
      <div
        onClick={() => {
          setIsOn(!isOn);
          toggle(isOn);
        }}
        style={{
          width: '50px',
          height: '25px',
          borderRadius: '15px',
          background: isOn ? '#4caf50' : '#ccc',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          cursor: 'pointer',
          justifyContent: isOn ? 'flex-end' : 'flex-start', // Align the knob
        }}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#fff',
          }}
        />
      </div>
    </div>
  );
}

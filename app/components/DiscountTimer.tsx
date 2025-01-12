'use client';

import { useEffect, useState } from 'react';

export default function DiscountTimer({ end }: { end: number }) {
  const [time, setTime] = useState(new Date().getTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center pt-2">
      <p>اتمام تخفیف:</p>
      <div className="flex flex-wrap gap-2">
        <p className="text-sm px-1 rounded-xl border-accent-pink bg-white border-2">
          {end - time > 0
            ? Math.floor((end - time) / (1000 * 60 * 60 * 24))
            : 0}{' '}
          روز
        </p>
        <div className="flex gap-2">
          <p className="text-sm">و</p>
          <p className="text-sm px-1 rounded-xl border-accent-pink bg-white border-2">
            {end - time > 0
              ? Math.floor(
                  ((end - time) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                )
              : 0}{' '}
            ساعت
          </p>
        </div>
        <div className="flex gap-2">
          <p className="text-sm">و</p>
          <p className="text-sm px-1 rounded-xl border-accent-pink bg-white border-2">
            {end - time > 0
              ? Math.floor(((end - time) % (1000 * 60 * 60)) / (1000 * 60))
              : 0}{' '}
            دقیقه
          </p>
        </div>
        <div className="flex gap-2">
          <p className="text-sm">و</p>
          <p className="text-sm px-1 rounded-xl border-accent-pink bg-white border-2">
            {end - time > 0
              ? Math.floor(((end - time) % (1000 * 60)) / 1000)
              : 0}{' '}
            ثانیه
          </p>
        </div>
      </div>
    </div>
  );
}

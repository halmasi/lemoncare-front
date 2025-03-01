import { useEffect, useState } from 'react';
interface CourierProps {
  courierCode: string;
  courierName: string;
  courierServiceId: number;
  courierServiceName: string;
  days: string;
  slaHours: number;
  taxPercent: number;
}
interface PostMethodsProps {
  isSuccess: boolean;
  data: CourierProps[];
}
export default function DeliveryMethods() {
  const [courier, setCourier] = useState<CourierProps[]>([]);
  const [selected, setSelected] = useState<CourierProps>(courier[0]);
  const [shipingPrice, SetShipingPrice] = useState(0);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/checkout');
      const data: PostMethodsProps = await res.json();
      if (data.isSuccess) {
        data.data.map((item) => {
          if (
            item.courierName == 'شرکت ملی پست' ||
            item.courierName == 'تیپاکس' ||
            item.courierName == 'چاپار'
          )
            setCourier((prev) => {
              const copy = prev;
              copy.push(item);
              return copy;
            });
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (selected) {
      console.log(selected);
      (async () => {
        SetShipingPrice(0);
      })();
    }
  }, [selected]);

  return (
    <>
      <div className="flex gap-2 items-center">
        <h6>هزینه ارسال:</h6>
        <p>{shipingPrice}</p>
      </div>
      <div className="flex flex-wrap">
        {courier.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setSelected(item);
            }}
            className={`p-2 text-center rounded-lg border m-2 aspect-square w-40 ${selected == item && 'bg-accent-pink/20 hover:bg-accent-pink/20'} hover:bg-gray-200`}
          >
            <p>{item.courierName}</p>
            <p>{item.courierServiceName}</p>
          </button>
        ))}
      </div>
    </>
  );
}

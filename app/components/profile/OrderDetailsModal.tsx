import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductDetailsProps {
  id: number;
  basicInfo: {
    title: string;
    mainImage: {
      formats: {
        thumbnail: {
          url: string;
        };
      };
    };
  };
  variety: {
    color: string;
    uniqueId: string;
    subVariety: {
      uniqueId: string;
    }[];
  }[];
}

export interface OrderDetailsModalProps {
  order: {
    pay: boolean;
    items: {
      count: number;
      product: {
        id: number;
        basicInfo: {
          title: string;
          mainImage: {
            formats: {
              thumbnail: {
                url: string;
              };
            };
          };
        };
        variety: {
          color: string;
          uniqueId: string; // Ensure this is a string
          subVariety: {
            uniqueId: string; // Ensure this is a string
          }[];
        }[];
      };
      variety: {
        id: string; // Ensure this is a string
        sub: string | null; // Ensure this is a string or null
      };
    }[];
  } | null;
  productDetails?: any;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  if (!order) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl w-96"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
      >
        <h2 className="text-xl font-bold mb-4">جزئیات سفارش</h2>

        {order.items.length > 0 ? (
          order.items.map((item, index) => {
            const { product, variety: selectedVariety } = item;

            // Find the matched variety based on the unique ID
            const matchedVariety = Array.isArray(product.variety)
              ? product.variety.find((v) => v.uniqueId === selectedVariety.id)
              : null;

            const color = matchedVariety?.color || 'نامشخص';

            return (
              <div
                key={index}
                className="flex items-center gap-3 border-b pb-2 mb-2"
              >
                <Image
                  src={
                    product.basicInfo.mainImage?.formats?.thumbnail?.url ||
                    '/placeholder.png'
                  }
                  alt={product.basicInfo.title || 'بدون نام'}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {product.basicInfo.title || 'بدون نام'}
                  </p>
                  <p className="text-sm text-gray-500">🎨 رنگ: {color}</p>
                  <p className="text-sm text-gray-500">
                    🛍️ تعداد: {item.count}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      order.pay ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    💳 وضعیت پرداخت:{' '}
                    {order.pay ? 'پرداخت شده' : 'در انتظار پرداخت'}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">هیچ محصولی یافت نشد.</p>
        )}

        <button
          className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={onClose}
        >
          بستن
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsModal;

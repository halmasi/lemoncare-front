import { FaStar } from 'react-icons/fa';
import SubmitButton from './formElements/SubmitButton';
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addComment } from '../utils/data/getComments';
import { toast } from 'react-toastify';

export default function NewCommentForm({ productId }: { productId: string }) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [colors, setColors] = useState({
    star1: true,
    star2: true,
    star3: true,
    star4: true,
    star5: true,
  });

  const [selected, setSelected] = useState({
    star1: true,
    star2: true,
    star3: true,
    star4: true,
    star5: true,
  });

  const [rate, setRate] = useState<1 | 2 | 3 | 4 | 5>(5);

  const handleSubmit = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = textRef.current?.value || '';

      await addComment({
        productId,
        rate,
        text,
      });
    },
    onSuccess: () => {
      if (textRef.current) textRef.current.value = '';
      toast.success('دیدگاه شما ثبت و برای بررسی ارسال شد.');
    },
  });

  return (
    <form
      onSubmit={handleSubmit.mutate}
      className="w-full flex flex-col gap-5 bg-gray-100 p-10 rounded-lg border"
    >
      <div className="flex flex-wrap gap-5">
        <div className="w-full md:w-[20%]">
          <p>امتیازدهی</p>
          <div className="flex w-fit">
            {/* //// */}
            <p
              className={`hover:text-accent-yellow p-1 ${(colors.star1 || selected.star1) && 'text-accent-yellow'}`}
              onClick={() => {
                setRate(1);
                setSelected({
                  star1: true,
                  star2: false,
                  star3: false,
                  star4: false,
                  star5: false,
                });
              }}
            >
              <FaStar />
            </p>
            <p
              className={`p-1 ${(colors.star2 || selected.star2) && 'text-accent-yellow'}`}
              onClick={() => {
                setRate(2);
                setSelected({
                  star1: true,
                  star2: true,
                  star3: false,
                  star4: false,
                  star5: false,
                });
              }}
              onMouseEnter={() => {
                setColors({
                  star1: true,
                  star2: true,
                  star3: false,
                  star4: false,
                  star5: false,
                });
              }}
              onMouseLeave={() => {
                setColors({
                  star1: false,
                  star2: false,
                  star3: false,
                  star4: false,
                  star5: false,
                });
              }}
            >
              <FaStar />
            </p>
            <p
              className={`p-1 ${(colors.star3 || selected.star3) && 'text-accent-yellow'}`}
              onClick={() => {
                setRate(3);
                setSelected({
                  star1: true,
                  star2: true,
                  star3: true,
                  star4: false,
                  star5: false,
                });
              }}
              onMouseEnter={() => {
                setColors({
                  star1: true,
                  star2: true,
                  star3: true,
                  star4: false,
                  star5: false,
                });
              }}
              onMouseLeave={() => {
                setColors({
                  star1: false,
                  star2: false,
                  star3: false,
                  star4: false,
                  star5: false,
                });
              }}
            >
              <FaStar />
            </p>
            <p
              className={`p-1 ${(colors.star4 || selected.star4) && 'text-accent-yellow'}`}
              onClick={() => {
                setRate(4);
                setSelected({
                  star1: true,
                  star2: true,
                  star3: true,
                  star4: true,
                  star5: false,
                });
              }}
              onMouseEnter={() => {
                setColors({
                  star1: true,
                  star2: true,
                  star3: true,
                  star4: true,
                  star5: false,
                });
              }}
              onMouseLeave={() => {
                setColors({
                  star1: false,
                  star2: false,
                  star3: false,
                  star4: false,
                  star5: false,
                });
              }}
            >
              <FaStar />
            </p>
            <p
              className={`p-1 ${(colors.star5 || selected.star5) && 'text-accent-yellow'}`}
              onClick={() => {
                setRate(5);
                setSelected({
                  star1: true,
                  star2: true,
                  star3: true,
                  star4: true,
                  star5: true,
                });
              }}
              onMouseEnter={() => {
                setColors({
                  star1: true,
                  star2: true,
                  star3: true,
                  star4: true,
                  star5: true,
                });
              }}
              onMouseLeave={() => {
                setColors({
                  star1: false,
                  star2: false,
                  star3: false,
                  star4: false,
                  star5: false,
                });
              }}
            >
              <FaStar />
            </p>
            {/* //// */}
          </div>
        </div>
      </div>
      <fieldset>
        <label className="text-gray-700" htmlFor="text">
          متن دیدگاه:
        </label>
        <textarea
          ref={textRef}
          title="متن دیدگاه:"
          className="border rounded-lg w-full h-32 p-3 focus:outline-none"
          name="text"
          id="text"
        />
      </fieldset>
      <SubmitButton
        disabled={handleSubmit.isPending}
        className="self-start bg-green-700 text-white"
      >
        ثبت دیدگاه
      </SubmitButton>
    </form>
  );
}

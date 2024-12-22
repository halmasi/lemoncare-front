interface InputProps {
  format?: string;
  placeholder: string;
}

export default function InputBox({ format, placeholder }: InputProps) {
  return (
    <input
      className="p-2 border-2 border-gray-400 rounded-xl shadow-md focus:shadow-[rgb(255,26,198,0.8)_0px_0px_7px_0.3px] focus:outline-none transition-all"
      type={format || 'text'}
      placeholder={placeholder}
    />
  );
}

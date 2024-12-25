interface InputProps {
  format?: string;
  placeholder: string;
}

export default function InputBox({ format, placeholder }: InputProps) {
  return (
    <input
      className="p-2 border-2 border-gray-400 rounded-sm shadow-lg focus:shadow-accent-pink/30 focus:outline-none transition-all"
      type={format || 'text'}
      placeholder={placeholder}
    />
  );
}

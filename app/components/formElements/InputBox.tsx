interface InputProps {
  format?: string;
  placeholder: string;
  name: string;
}

export default function InputBox({ format, placeholder, name }: InputProps) {
  return (
    <input
      className="p-2 border-2 border-gray-400 rounded-xl shadow-lg focus:shadow-accent-pink/30 focus:outline-none transition-all"
      type={format || 'text'}
      placeholder={placeholder}
      name={name}
    />
  );
}

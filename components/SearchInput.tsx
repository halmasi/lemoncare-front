import { IoSearch } from 'react-icons/io5';
export default function SearchInput() {
  return (
    <div className="w-full">
      <form className="flex h-fit justify-center mb-5 md:mb-0 border rounded-full hover:border-yellow-300">
        <input
          className="text-right w-full px-1 h-auto bg-gray-100 rounded-r-full border border-l-0 focus:outline-none"
          type="search"
          name="q"
          id="searchbox"
          placeholder={`جستجو ...`}
        />
        <button
          className="pl-3 h-10 flex items-center justify-center rounded-l-full border border-r-0 transition-all duration-100 bg-gray-100 text-gray-500 hover:text-gray-700 hover:text-lg focus:text-gray-950"
          type="submit"
        >
          <IoSearch />
        </button>
      </form>
    </div>
  );
}

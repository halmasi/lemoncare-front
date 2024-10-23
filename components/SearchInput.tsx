export default function SearchInput() {
  return (
    <form
      className="flex flex-row-reverse justify-center mb-5"
      action="/search"
    >
      <input
        className="text-right px-1 h-auto bg-white rounded-r-lg border border-l-0 hover:border-yellow-300 focus:outline-none focus:border-yellow-500"
        type="search"
        name="q"
        id="searchbox"
        placeholder={`... جستجو`}
      />
      <button
        className="w-14 h-10 flex items-center justify-center rounded-l-lg transition-all duration-100 bg-yellow-500 text-white hover:bg-yellow-700 hover:text-lg focus:bg-yellow-900"
        type="submit"
      >
        search
      </button>
    </form>
  );
}

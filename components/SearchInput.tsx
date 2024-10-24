import { IoSearch } from "react-icons/io5";
export default function SearchInput() {
	return (
		<div className='w-full'>
			<form className='flex h-fit justify-center mb-5 md:mb-0 border rounded-lg'>
				<input
					className='text-right w-full px-1 h-auto bg-white rounded-r-lg border border-l-0 hover:border-yellow-300 focus:outline-none focus:border-yellow-500'
					type='search'
					name='q'
					id='searchbox'
					placeholder={`جستجو ...`}
				/>
				<button
					className='w-14 h-10 flex items-center justify-center rounded-l-lg transition-all duration-100 bg-yellow-500 text-white hover:bg-yellow-700 hover:text-lg focus:bg-yellow-900'
					type='submit'
				>
					<IoSearch />
				</button>
			</form>
		</div>
	);
}

export default function Toast({ showToast, message } : { showToast: boolean, message: string }) {
  return (
    <div
      className={`z-[100] fixed top-10 left-1/2 transform -translate-x-1/2 bg-[#191919] text-white px-4 py-2 rounded shadow-md transition-all duration-300 ease-in-out ${
        showToast ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-50'
      }`}
    >
      {message}
    </div>
  );
}
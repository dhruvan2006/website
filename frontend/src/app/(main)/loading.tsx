export default function Loading() {
  return (
    <div className='h-[88vh] flex items-center justify-center bg-white dark:bg-zinc-900'>
      <div className="animate-spin rounded-full h-32 w-32 border-8 border-black dark:border-white border-t-8 border-t-transparent dark:border-t-transparent"></div>
    </div>
  );
}
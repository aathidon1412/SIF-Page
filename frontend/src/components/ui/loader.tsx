const Loader = () => {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center">
      <div className="w-20 h-20 border-4 border-transparent text-blue-900 text-4xl animate-spin flex items-center justify-center border-t-blue-900 rounded-full">
        <div className="w-16 h-16 border-4 border-transparent text-yellow-300 text-2xl animate-spin flex items-center justify-center border-t-yellow-300 rounded-full" />
      </div>
    </div>
  );
}

export default Loader;

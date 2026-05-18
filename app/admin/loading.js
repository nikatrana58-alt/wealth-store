export default function AdminRouteLoading() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-5">
      <div className="glass w-full max-w-md rounded-4xl border border-white/10 p-8 text-center">
        <div className="mx-auto w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <h1 className="text-3xl font-black mt-7">Opening admin console</h1>
        <p className="text-gray-500 mt-3 leading-7">
          Preparing your dashboard.
        </p>
      </div>
    </div>
  );
}

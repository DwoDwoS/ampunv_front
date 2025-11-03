import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white sm:text-6xl">
          Welcome to Ampunv Frontend!
        </h1>
        <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 sm:text-xl">
          This is the default landing page for the Ampunv Frontend application.
        </p>
      </main>
    </div>
  );
}

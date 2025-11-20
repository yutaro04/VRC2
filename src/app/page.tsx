import {FloatingNav} from "../components/shared/FloatingNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <FloatingNav />
      <div className="p-8">
        <h1 className="text-3xl font-semibold">Hello, world!!</h1>
        <p className="mt-4 text-gray-300">トップページのプレビューです。</p>
      </div>
    </main>
  );
}

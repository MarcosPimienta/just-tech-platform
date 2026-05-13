import Link from 'next/link';
import Image from 'next/image';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="max-w-4xl w-full bg-white p-12 rounded-2xl shadow-xl border border-gray-100 relative z-10">
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Just Tech Logo" width={100} height={100} className="object-contain" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 font-heading mb-4">
            Just Tech Platform
          </h1>
          <p className="text-xl text-gray-600 italic">
            Interactive learning, built by the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/tech/react" className="block group">
            <div className="bg-[#fdfaf5] border border-gray-200 rounded-lg p-6 h-full relative transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#0f4a8a]">
              <span className="absolute top-4 right-4 bg-[#0f4a8a] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full">
                Active
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">React Bolt</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Learn React state and inputs by doing short, interactive exercises.
              </p>
            </div>
          </Link>

          <div className="bg-[#f5f0e0] border border-gray-200 rounded-lg p-6 h-full relative opacity-70 cursor-not-allowed">
            <span className="absolute top-4 right-4 bg-gray-400 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full">
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">JS Bolt</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Master Vanilla JavaScript concepts without the fluff.
            </p>
          </div>

          <div className="bg-[#f5f0e0] border border-gray-200 rounded-lg p-6 h-full relative opacity-70 cursor-not-allowed">
            <span className="absolute top-4 right-4 bg-gray-400 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full">
              Coming Soon
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Angular Bolt</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dive into Angular components and services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

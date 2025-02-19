import { useState, useEffect, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

const Hero = () => {
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    const newArcs = [...Array(15)].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: 'rgba(80, 200, 120, 0.8)',
    }));
    setArcsData(newArcs);

    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
      }
    }
  }, []);

  return (
    <div className='flex flex-col md:flex-row items-center justify-center h-[calc(100vh-80px)] bg-white px-4 sm:px-8 md:px-16 lg:px-24 overflow-hidden'>
      {/* Left side - Text content */}
      <div className='z-10 w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0 mt-8 md:mt-0'>
        <p className='text-primary/70 text-base sm:text-lg mb-2'>EXPLORE AFRICA</p>
        <div className='mb-4'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold'>Discover the</h1>
          <h4 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-secondary'>Soul of Africa!</h4>
        </div>
        <p className=' text-base sm:text-lg'>Crafting unforgettable journeys across the African continent.</p>
      </div>

      {/* Globe - Visible on all screen sizes */}
      <div className='w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] flex justify-center items-center pointer-events-none'>
        <div className='relative w-full h-full flex justify-center items-center max-w-[280px] max-h-[280px] sm:max-w-[320px] sm:max-h-[320px] md:max-w-[400px] md:max-h-[400px] lg:max-w-[500px] lg:max-h-[500px]'>
          <Globe
            ref={globeRef}
            globeImageUrl='//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
            bumpImageUrl='//unpkg.com/three-globe/example/img/earth-topology.png'
            width={500}
            height={500}
            backgroundColor='rgba(255,255,255,0)'
            showAtmosphere={true}
            atmosphereColor='lightskyblue'
            atmosphereAltitude={0.15}
            enablePointerInteraction={false}
            arcsData={arcsData}
            arcColor='color'
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={1500}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React, { useEffect, useState } from 'react';
import logoSif from '../../assets/SIF logo.png';
import logoLorem1 from '../../assets/temp lorem logo 1.png';
import logoLorem2 from '../../assets/temp lorem logo 2.png';

type FloatingLogoProps = {
  side?: 'left' | 'right';
  interval?: number; // milliseconds
};

const FloatingLogo: React.FC<FloatingLogoProps> = ({ side = 'right', interval = 4000 }) => {
  const logos = [logoSif, logoLorem1, logoLorem2];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % logos.length), interval);
    return () => clearInterval(t);
  }, [interval]);

  return (
    <div
      aria-hidden="false"
      className={`fixed top-6 z-50 ${side === 'right' ? 'right-6' : 'left-6'}`}
    >
      <a href="/" aria-label="SIF-FABLAB home" className="block">
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          {logos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={i === 0 ? 'SIF-FABLAB logo' : ''}
              className={`absolute inset-0 w-full h-full object-contain rounded-full transition-opacity duration-700 ${
                i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          ))}
        </div>
      </a>
    </div>
  );
};

export default FloatingLogo;

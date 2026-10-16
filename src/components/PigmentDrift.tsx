import React from 'react';
import { useTheme } from 'next-themes';

const TEXTURES = {
  hero: {
    light:
      'https://media.base44.com/images/public/6acf9da0229a21e90a8ecab2/e5e1b3613_generated_image.png',
    dark:
      'https://media.base44.com/images/public/6acf9da0229a21e90a8ecab2/abcf14a64_generated_image.png',
  },
  cta: {
    light:
      'https://media.base44.com/images/public/6acf9da0229a21e90a8ecab2/cf39cea4d_generated_image.png',
    dark:
      'https://media.base44.com/images/public/6acf9da0229a21e90a8ecab2/9ef6ce1b5_generated_image.png',
  },
};

export default function PigmentDrift({
  variant = 'hero',
  className = '',

  // Rotate the actual watercolor image
  imageAngle = 0,

  // Direction of the color-to-transparent fade
  // 90deg = left to right
  // 180deg = top to bottom
  fadeAngle = 90,
  fadeStart = 0, // Fade length at the beginning, in %
  fadeEnd = 0,   // Fade length at the end, in %

  // Black overlay: 0 = none, 1 = black
  darkness = 0.25,

  backdropBlur = 0,          // Blur in pixels
  backdropBrightness = 1,    // 1 = normal, 0.5 = darker
  backdropSaturate = 1,     // 1 = normal, 0 = grayscale

  saturation = 1,
  brightness = 1,
  opacity = 1,
  blendMode = 'normal',
  textureScale = 'cover',

  fade = true,
}) {
  const { resolvedTheme } = useTheme();

  const textures = TEXTURES[variant] ?? TEXTURES.hero;
  const tex = textures[
    resolvedTheme === 'dark' ? 'dark' : 'light'
  ];

  const normalizedFadeAngle =
    ((Number(fadeAngle) % 360) + 360) % 360;

  const normalizedImageAngle =
    ((Number(imageAngle) % 360) + 360) % 360;

  const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number(value) || 0));

  const startFade = clamp(fadeStart, 0, 49);
  const endFade = clamp(fadeEnd, 0, 49);

  const gradientStops = [
    `transparent 0%`,
    `black ${startFade}%`,
    `black ${100 - endFade}%`,
    `transparent 100%`,
  ].join(', ');

  const pigmentStyle = {
    backgroundImage: `url("${tex}")`,
    backgroundSize: textureScale,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity,
    filter: `saturate(${saturation}) brightness(${brightness})`,
    mixBlendMode: blendMode,

    ...(fade
      ? {
        maskImage: `linear-gradient(
          ${normalizedFadeAngle}deg,
          ${gradientStops}
        )`,
        WebkitMaskImage: `linear-gradient(
          ${normalizedFadeAngle}deg,
          ${gradientStops}
        )`,
      }
      : {}),
  };

  return (
    <div
      className={`pigment-drift ${className}`}
      aria-hidden="true"
      style={{
        '--pigment-darkness': Math.min(
          1,
          Math.max(0, Number(darkness))
        ),
        '--pigment-backdrop-blur': `${Math.max(
          0,
          Number(backdropBlur)
        )}px`,
        '--pigment-backdrop-brightness': Math.max(
          0,
          Number(backdropBrightness)
        ),
        '--pigment-backdrop-saturate': Math.max(
          0,
          Number(backdropSaturate)
        ),
      }}
    >
      <div className="pigment-drift__rotation">
        <div
          className="pigment-drift__tex"
          style={{
            ...pigmentStyle,
            transform: `rotate(${normalizedImageAngle}deg)`,
          }}
        />
      </div>

      <div className="pigment-drift__shade" />
      <div className="pigment-drift__grain" />
    </div>
  );
}
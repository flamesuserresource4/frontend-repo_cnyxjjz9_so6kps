import Spline from '@splinetool/react-spline';

export default function HeroScene() {
  return (
    <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden border">
      <Spline scene="https://prod.spline.design/M5rP8a3b6cFAkB0o/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
    </div>
  );
}

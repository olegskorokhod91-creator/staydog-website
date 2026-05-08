/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#06111f',
        ink: '#0c1828',
        frost: '#eef8ff',
        stayblue: '#58c7ff',
        glowblue: '#9ee7ff',
        warmgold: '#d8ad68',
        champagne: '#f2dfba',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 70px rgba(88, 199, 255, 0.32)',
        gold: '0 20px 80px rgba(216, 173, 104, 0.22)',
      },
      backgroundImage: {
        'mesh-night':
          'radial-gradient(circle at 20% 20%, rgba(88,199,255,.28), transparent 28%), radial-gradient(circle at 82% 18%, rgba(216,173,104,.16), transparent 24%), linear-gradient(135deg, #06111f 0%, #0b1930 48%, #05080f 100%)',
        'mesh-light':
          'radial-gradient(circle at 16% 14%, rgba(88,199,255,.22), transparent 28%), radial-gradient(circle at 90% 10%, rgba(216,173,104,.18), transparent 22%), linear-gradient(180deg, #fbfdff 0%, #edf6fb 100%)',
      },
    },
  },
  plugins: [],
}

import React, { Component } from 'react';
import { Dithering } from '@paper-design/shaders-react';
import { useTheme } from '../context/ThemeContext';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Shader rendering fallback active:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function ShaderBackground() {
  const containerRef = React.useRef(null);
  const [isInView, setIsInView] = React.useState(true);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Color palette swaps between dark and light themes
  const colorFront = isDark ? '#59533C' : '#9E8A60';
  const colorBack  = isDark ? '#00000000' : '#EDE9DF00';
  const fallbackBg = isDark
    ? 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(89,83,60,0.5), rgba(0,0,0,0))'
    : 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(158,138,96,0.30), rgba(237,233,223,0))';
  const vignette = isDark
    ? 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 60%, #000000 100%)'
    : 'linear-gradient(180deg, rgba(237,233,223,0.06) 0%, rgba(237,233,223,0.38) 60%, #EDE9DF 100%)';
  const baseBg = isDark ? '#000000' : '#EDE9DF';

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden pointer-events-none">
      {/* Background base — adapts to theme */}
      <div className="absolute inset-0 transition-colors duration-300" style={{ backgroundColor: baseBg }} />

      {/* Dithering Shader with ErrorBoundary (Only active when in viewport) */}
      <ErrorBoundary
        fallback={
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: fallbackBg }}
          />
        }
      >
        {isInView ? (
          <Dithering
            speed={0.23}
            shape="warp"
            type="4x4"
            size={2}
            scale={1.78}
            colorBack={colorBack}
            colorFront={colorFront}
            className="w-full h-full absolute inset-0 object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: fallbackBg }}
          />
        )}
      </ErrorBoundary>

      {/* Atmospheric vignette & fade layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{ background: vignette }}
      />
    </div>
  );
}

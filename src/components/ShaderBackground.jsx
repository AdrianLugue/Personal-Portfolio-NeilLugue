import React, { Component } from 'react';
import { Dithering } from '@paper-design/shaders-react';

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
      {/* Background base */}
      <div className="absolute inset-0 bg-black" />

      {/* Dithering Shader with ErrorBoundary (Only active when in viewport) */}
      <ErrorBoundary
        fallback={
          <div
            className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(89,83,60,0.5),rgba(0,0,0,0))]"
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
            colorBack="#00000000"
            colorFront="#59533C"
            className="w-full h-full absolute inset-0 object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(89,83,60,0.5),rgba(0,0,0,0))]"
          />
        )}
      </ErrorBoundary>

      {/* Atmospheric vignette & fade layer matching Paper's gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 60%, #000000 100%)',
        }}
      />
    </div>
  );
}

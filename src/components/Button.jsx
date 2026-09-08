import React from 'react';
import { Link } from 'react-router-dom';
import { useSmoothScroll } from '../context/SmoothScrollContext';

/**
 * Reusable Button component matching the Hero page's editorial Paper aesthetic.
 * Features:
 * - Frosted golden translucent glassmorphism (rgba(127, 114, 85, 0.5))
 * - High-contrast crisp border with glowing hover physics & elevation
 * - Seamless support for <button>, <a>, or React Router <Link>
 * - Configurable sizes ('sm', 'md', 'lg'), icons, and variants
 */
export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'paper',
  size = 'md',
  icon = null,
  iconPosition = 'right',
  iconRight = null,
  iconLeft = null,
  className = '',
  disabled = false,
  target,
  rel,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const { scrollTo } = useSmoothScroll();

  // Size classes
  const sizeClasses = {
    sm: 'h-[36px] sm:h-[38px] px-4 text-xs gap-1.5',
    md: 'h-[42px] sm:h-[44px] px-5 sm:px-6 text-xs sm:text-sm gap-1.5',
    lg: 'h-[48px] sm:h-[50px] px-7 text-sm sm:text-base gap-2',
  }[size] || 'h-[44px] px-6 text-sm gap-1.5';

  // Variant classes
  const variantClasses = {
    paper: 'btn-paper text-white',
    gold: 'bg-gradient-to-r from-[#FFD54F] to-[#C6B99B] text-black font-bold border border-white/60 hover:border-white shadow-[0_0_20px_rgba(255,213,79,0.35)] hover:shadow-[0_0_30px_rgba(255,213,79,0.5)] hover:-translate-y-0.5 active:translate-y-0',
    outline: 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/20 hover:border-white/50 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md',
  }[variant] || 'btn-paper text-white';

  const baseClasses = `inline-flex items-center justify-center font-montserrat font-semibold tracking-[0.04em] uppercase select-none cursor-pointer rounded-[10px] group transition-all duration-200 ${sizeClasses} ${variantClasses} ${
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
  } ${className}`;

  // Resolve left/right icons
  const resolvedLeftIcon = iconLeft || (icon && iconPosition === 'left' ? icon : null);
  const resolvedRightIcon = iconRight || (icon && iconPosition === 'right' ? icon : null);

  const content = (
    <>
      {resolvedLeftIcon && <span className="inline-flex shrink-0">{resolvedLeftIcon}</span>}
      {children && <span>{children}</span>}
      {resolvedRightIcon && <span className="inline-flex shrink-0">{resolvedRightIcon}</span>}
    </>
  );

  // If `to` is provided, render react-router Link
  if (to && !disabled) {
    return (
      <Link to={to} className={baseClasses} aria-label={ariaLabel} {...props}>
        {content}
      </Link>
    );
  }

  // If `href` is provided, render anchor <a>
  if (href && !disabled) {
    const isInternalHash = href.startsWith('#');
    return (
      <a
        href={href}
        className={baseClasses}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        aria-label={ariaLabel}
        onClick={(e) => {
          if (isInternalHash) {
            e.preventDefault();
            scrollTo(href, { offset: -20 });
          }
          if (onClick) onClick(e);
        }}
        {...props}
      >
        {content}
      </a>
    );
  }

  // Default to <button>
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel}
      {...props}
    >
      {content}
    </button>
  );
}

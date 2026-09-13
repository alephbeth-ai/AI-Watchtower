import React from 'react';
import { Route, buildPath, navigate, isPlainLeftClick } from '../router';

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: Route;
  replace?: boolean;
}

/**
 * A real <a href> that routes in-app on a plain left click. Middle click,
 * ctrl/cmd click, right click and crawlers all see an ordinary link.
 */
export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const href = buildPath(to);
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (isPlainLeftClick(e)) {
          e.preventDefault();
          navigate(to, { replace });
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
};

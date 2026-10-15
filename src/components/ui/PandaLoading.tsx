import React from 'react';
import { Orb } from '@yogesharc/thinking-orbs';

export type PandaOrbState = 'working' | 'reasoning' | 'searching' | 'background' | 'retrying' | 'compacting' | 'waiting' | 'base';
type PandaLoadingProps = {
  state?: PandaOrbState;
  label?: string;
  size?: number;
  variant?: 'page' | 'inline' | 'compact';
  className?: string;
};

/** Shared Thinking Orbs loader for all Panda.fun loading and busy states. */
export function PandaLoading({
  state = 'working',
  label = 'Loading',
  size,
  variant = 'inline',
  className = '',
}: PandaLoadingProps) {
  const orbSize = size ?? (variant === 'page' ? 56 : variant === 'compact' ? 18 : 24);
  const isPage = variant === 'page';
  return (
    <div
      className={[
        'panda-thinking-orb',
        isPage ? 'panda-thinking-orb--page' : '',
        variant === 'compact' ? 'panda-thinking-orb--compact' : '',
        className,
      ].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Orb state={state} size={orbSize} label={label} />
      {label && <span className="panda-thinking-orb__label">{label}</span>}
    </div>
  );
}

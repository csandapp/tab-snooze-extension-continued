import React, { useRef, useState, useEffect } from 'react';

const TOOLTIP_SHOW_TIMEOUT = 600;
const TOOLTIP_HIDE_TIMEOUT = 100;

export default <P extends Record<string, any>>(WrappedComponent: React.ComponentType<P>) => {
  const TooltipHelper = (props: Omit<P, 'tooltipVisible' | 'tooltipText' | 'preventTooltip' | 'onTooltipAreaMouseEnter' | 'onTooltipAreaMouseLeave'>) => {
    // counts down until tooltip appears/hides
    const tooltipShowTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipHideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
    const [ tooltipVisibleState, setTooltipVisibleState ] = useState(false);
    const [ tooltipTextState, setTooltipTextState ] = useState("");

    // Cleanup function to clear timeouts when component unmounts
    // This prevents memory leaks and ensures no state updates after unmount
    useEffect(() => {
      return () => {
        if (tooltipShowTimeout.current) clearTimeout(tooltipShowTimeout.current);
        if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);
      };
    }, []);

    const onTooltipAreaMouseEnter = (tooltipText: string) => {
      setTooltipTextState(tooltipText);

      if (tooltipHideTimeout.current) {
        clearTimeout(tooltipHideTimeout.current);
      }

      // if tooltip already visible
      if (!tooltipVisibleState && !tooltipShowTimeout.current) {
        tooltipShowTimeout.current = setTimeout(() => {
          tooltipShowTimeout.current = null;
          setTooltipVisibleState(true);
        }, TOOLTIP_SHOW_TIMEOUT);
      }
    }

    const onTooltipAreaMouseLeave = () => {
      if (tooltipShowTimeout.current) {
        clearTimeout(tooltipShowTimeout.current);
        tooltipShowTimeout.current = null;
        setTooltipVisibleState(false);
      }

      tooltipHideTimeout.current = setTimeout(() => {
        setTooltipVisibleState(false);
      }, TOOLTIP_HIDE_TIMEOUT);
    }

    const preventTooltip  = () => {
      // Avoid showing tooltip after user already selected, its distructing
      if (tooltipShowTimeout.current) {
        clearTimeout(tooltipShowTimeout.current);
      }
    }

  const injectedProps = {
      tooltipVisible: tooltipVisibleState,
      tooltipText: tooltipTextState,
      preventTooltip,
      onTooltipAreaMouseEnter,
      onTooltipAreaMouseLeave,
    };

    const combinedProps = { ...injectedProps, ...props } as unknown as P;

    return (
      <WrappedComponent
        {...combinedProps}
      />
    );
  }

  return TooltipHelper;
};

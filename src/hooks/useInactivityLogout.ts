import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/useAuth';

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes (1 hour) in milliseconds

export const useInactivityLogout = () => {
  const { logout, currentUser } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (currentUser) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [logout, currentUser]);

  useEffect(() => {
    // Set up event listeners for user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initial timer setup
    resetTimer();

    return () => {
      // Clean up event listeners and timer
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  // Reset timer when currentUser changes (e.g., on login/logout)
  useEffect(() => {
    resetTimer();
  }, [currentUser, resetTimer]);
};
import { useCallback, useEffect, useState } from 'react';

type UseSharedLoadingHook = () => {
  isLoading: boolean;
  compositeLoading: (callback: () => void) => Promise<void>;
  increaseAmountRunningTasks: () => void;
  decreaseAmountRunningTasks: () => void;
  amountRunningTasks: number;
};

/**
 * Custom hook to access a shared loading state in a component.
 * The hook provides a wrapper for multiple composite function executions.
 */
export const useSharedLoading: UseSharedLoadingHook = () => {
  // amount running tasks to gather composite loading executions from consumers of this hook
  const [amountRunningTasks, setAmountRunningTasks] = useState<number>(0);
  // shared isLoading state for all consuming components
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(amountRunningTasks !== 0);
  }, [amountRunningTasks]);

  const increaseAmountRunningTasks = () => {
    setAmountRunningTasks(oldAmount => oldAmount + 1);
  };

  const decreaseAmountRunningTasks = () => {
    setAmountRunningTasks(oldAmount => oldAmount - 1);
  };

  // wrapper function to increase/decrease the amount of running tasks, should be used by the consuming components
  const compositeLoading = useCallback(async (callback: () => void) => {
    increaseAmountRunningTasks();
    try {
      await callback();
    } catch (e) {
      throw new Error(e);
    } finally {
      decreaseAmountRunningTasks();
    }
  }, []);

  return {
    amountRunningTasks,
    compositeLoading,
    decreaseAmountRunningTasks,
    increaseAmountRunningTasks,
    isLoading,
  };
};

'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

const filters = [
  { name: 'React', value: 'react' },
  { name: 'javaScript', value: 'javascript' },

  // { name: 'Newest', value: 'newest' },
  // { name: 'Popular', value: 'popular' },
  // { name: 'Unanswered', value: 'unanswered' },
  // { name: 'Recommended', value: 'recommended' },
];

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get('filter');
  const [active, setActive] = useState(filterParams || '');

  /**
   * Handles the click event for selecting a filter type.
   *
   * This function updates the active filter state and modifies the URL query parameters
   * based on the selected filter. If the selected filter is already active, it removes
   * the filter from the URL query. Otherwise, it sets the selected filter as active and
   * updates the URL query accordingly.
   *
   * @param {string} filter - The filter type that was clicked.
   */
  const handleTypeClick = (filter: string) => {
    let newUrl = '';

    if (filter === active) {
      setActive('');

      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['filter'],
      });
    } else {
      setActive(filter);

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: filter.toLowerCase(),
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter: { name: string; value: string }) => (
        <Button
          key={filter.name}
          className={cn(
            `body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
            active === filter.value
              ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400'
              : 'bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300',
          )}
          onClick={() => handleTypeClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;

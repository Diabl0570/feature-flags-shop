'use client';

import { useEffect, useState } from 'react';

interface FlagOption {
  value: unknown;
  label?: string;
}

interface FlagMetadata {
  key: string;
  description?: string;
  options?: FlagOption[];
  defaultValue?: unknown;
}

interface FlagsData {
  definitions: Record<string, FlagMetadata>;
}

interface OverridesResponse {
  overrides: Record<string, unknown>;
}

export default function FlagsToolbar() {
  const [flags, setFlags] = useState<FlagsData | null>(null);
  const [overrides, setOverrides] = useState<Record<string, unknown>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchToolbarData = async () => {
      try {
        const [flagsResponse, overridesResponse] = await Promise.all([
          fetch('/api/flags'),
          fetch('/api/flag-overrides'),
        ]);

        if (!flagsResponse.ok) {
          throw new Error('Failed to load flag definitions');
        }

        const flagsData = (await flagsResponse.json()) as FlagsData;
        const overridesData = overridesResponse.ok
          ? ((await overridesResponse.json()) as OverridesResponse)
          : { overrides: {} };

        if (!isMounted) {
          return;
        }

        setFlags(flagsData);
        setOverrides(overridesData.overrides ?? {});
      } catch (error) {
        console.error('Failed to initialize toolbar data:', error);
      }
    };

    fetchToolbarData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFlagChange = async (key: string, value: unknown) => {
    setIsLoading(true);
    const newOverrides = { ...overrides, [key]: value };
    setOverrides(newOverrides);

    try {
      await fetch('/api/flag-overrides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      });

      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Failed to set override:', error);
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/flag-overrides', { method: 'DELETE' });
      setOverrides({});
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset overrides:', error);
      setIsLoading(false);
    }
  };

  const renderControl = (flagKey: string, metadata: FlagMetadata) => {
    const currentValue = overrides[flagKey] ?? metadata.defaultValue;
    const options = metadata.options ?? [];
    const isBooleanToggle =
      options.length === 2 &&
      options.every((option) => typeof option.value === 'boolean');

    // Boolean flags - render as toggle
    if (isBooleanToggle) {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentValue === true}
            onChange={(e) => handleFlagChange(flagKey, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            disabled={isLoading}
          />
          <span className="text-sm">
            {currentValue ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      );
    }

    // String/number flags - render as dropdown
    if (options.length > 0) {
      const selectedIndex = options.findIndex(
        (option) => option.value === currentValue,
      );

      return (
        <select
          value={selectedIndex >= 0 ? String(selectedIndex) : '0'}
          onChange={(e) => {
            const option = options[Number(e.target.value)];
            if (!option) {
              return;
            }

            handleFlagChange(flagKey, option.value);
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {options.map((option, index) => (
            <option key={`${flagKey}-${String(option.value)}`} value={String(index)}>
              {option.label ?? String(option.value)}
            </option>
          ))}
        </select>
      );
    }

    return null;
  };

  // if (process.env.NODE_ENV === 'production') {
  //   return null;
  // }

  if (!flags) {
    return null;
  }

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
            />
          </svg>
          <span className="font-medium">Feature Flags</span>
          <span className="bg-blue-600 text-xs px-2 py-1 rounded">
            {Object.keys(flags.definitions || {}).length}
          </span>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[600px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <h2 className="font-semibold">Feature Flags</h2>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:bg-gray-800 rounded p-1 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {Object.entries(flags.definitions || {}).map(([key, metadata]) => (
                <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {key}
                      </h3>
                      {metadata.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {metadata.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {renderControl(key, metadata)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <button
              onClick={handleReset}
              disabled={isLoading || !hasOverrides}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? 'Loading...' : 'Reset All Overrides'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Overrides are stored in browser cookies
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

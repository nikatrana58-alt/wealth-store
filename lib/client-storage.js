"use client";

import {
  useEffect,
  useState
} from "react";

function notifyStorageChange(key) {
  window.dispatchEvent(
    new CustomEvent("local-storage-change", {
      detail: { key },
    })
  );
}

function subscribe(onStoreChange) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event) => {
    if (
      !event.detail?.key ||
      typeof event.detail.key === "string"
    ) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(
    "local-storage-change",
    handleStorage
  );

  return () => {
    window.removeEventListener(
      "storage",
      onStoreChange
    );
    window.removeEventListener(
      "local-storage-change",
      handleStorage
    );
  };
}

export function readStoredJson(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function readStoredJsonSnapshot(key) {
  if (typeof window === "undefined") {
    return {
      hasValue: false,
      value: undefined,
    };
  }

  try {
    const item = window.localStorage.getItem(key);

    return item
      ? {
          hasValue: true,
          value: JSON.parse(item),
        }
      : {
          hasValue: false,
          value: undefined,
        };
  } catch {
    return {
      hasValue: false,
      value: undefined,
    };
  }
}

export function writeStoredJson(key, value) {
  window.localStorage.setItem(
    key,
    JSON.stringify(value)
  );
  notifyStorageChange(key);
}

export function removeStoredValue(key) {
  window.localStorage.removeItem(key);
  notifyStorageChange(key);
}

export function useStoredJson(
  key,
  fallbackValue
) {
  const [snapshot, setSnapshot] =
    useState({
      key,
      hasValue: false,
      value: undefined,
    });

  useEffect(() => {
    const readValue = () => {
      const stored =
        readStoredJsonSnapshot(key);

      setSnapshot({
        key,
        ...stored,
      });
    };

    readValue();

    return subscribe(readValue);
  }, [key]);

  return snapshot.key === key &&
    snapshot.hasValue
    ? snapshot.value
    : fallbackValue;
}

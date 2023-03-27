import { renderHook, act, waitFor } from '@testing-library/react';
import useLocalStorage from '../use-local-storage';

describe('useLocalStorage', () => {
  const key = 'testKey';
  const defaultValue = { foo: 'bar' };
  const serializedDefaultValue = JSON.stringify(defaultValue);
  const newValue = { foo: 'baz' };
  const serializedNewValue = JSON.stringify(newValue);

  afterEach(() => {
    if (
      window.localStorage &&
      typeof window.localStorage.clear === 'function'
    ) {
      window.localStorage.clear();
    }
  });

  it('should return the default value if the key is not in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(key, defaultValue));

    expect(result.current[0]).toEqual(defaultValue);
    expect(window.localStorage.getItem(key)).toEqual(serializedDefaultValue);
  });

  it('should return the value from localStorage if the key is in localStorage', () => {
    window.localStorage.setItem(key, serializedNewValue);

    const { result } = renderHook(() => useLocalStorage(key, defaultValue));

    expect(result.current[0]).toEqual(newValue);
    expect(window.localStorage.getItem(key)).toEqual(serializedNewValue);
  });

  it('should set the value in localStorage when the state is updated', () => {
    const { result } = renderHook(() => useLocalStorage(key, defaultValue));

    act(() => {
      result.current[1](newValue);
    });

    expect(window.localStorage.getItem(key)).toEqual(serializedNewValue);
  });

  it('should remove the old key from localStorage if the key is updated', async () => {
    const oldKey = 'oldKey';
    const newKey = 'newKey';
    window.localStorage.setItem(oldKey, serializedDefaultValue);

    const { result, rerender } = renderHook(
      ({ key }) => useLocalStorage(key, defaultValue),
      { initialProps: { key: oldKey } },
    );

    expect(window.localStorage.getItem(oldKey)).toBe(serializedDefaultValue);
    expect(window.localStorage.getItem(newKey)).toBeNull();

    rerender({ key: newKey });

    await waitFor(() => {
      expect(window.localStorage.getItem(oldKey)).toBeNull();
      expect(window.localStorage.getItem(newKey)).toBe(serializedDefaultValue);
    });

    act(() => {
      result.current[1](newValue);
    });

    expect(window.localStorage.getItem(newKey)).toEqual(serializedNewValue);
  });

  // it('should use the provided serializer and deserializer functions', () => {
  //   const serializer = jest.fn((value) => value);
  //   const deserializer = jest.fn((value) => value);

  //   const { result } = renderHook(() =>
  //     useLocalStorage(key, defaultValue, {
  //       serialize: serializer,
  //       deserialize: deserializer,
  //     }),
  //   );

  //   expect(result.current[0]).toEqual(defaultValue);
  //   expect(window.localStorage.getItem(key)).toEqual(serializedNewValue);

  //   const newValueSerialized = serializer(newValue);
  //   act(() => {
  //     result.current[1](newValue);
  //   });

  //   expect(window.localStorage.getItem(key)).toEqual(newValueSerialized);
  //   expect(serializer).toHaveBeenCalledWith(newValue);
  //   expect(deserializer).toHaveBeenCalledWith(newValueSerialized);
  // });

  // it('should handle error when localStorage throws an exception', async () => {
  //   const consoleErrorSpy = jest
  //     .spyOn(console, 'error')
  //     .mockImplementation(() => {});

  //   const localStorageMock = {
  //     getItem: jest.fn(() => {
  //       throw new Error('Simulated localStorage exception');
  //     }),
  //     setItem: jest.fn(() => {
  //       throw new Error('Simulated localStorage exception');
  //     }),
  //     removeItem: jest.fn(() => {
  //       throw new Error('Simulated localStorage exception');
  //     }),
  //   };

  //   // const localStorageMock = {
  //   //   getItem: jest.fn(() => null),
  //   //   setItem: jest.fn(() => null),
  //   //   removeItem: jest.fn(() => null),
  //   // };

  //   Object.defineProperty(window, 'localStorage', {
  //     value: localStorageMock,
  //     writable: true,
  //   });

  //   let result: any;
  //   await act(async () => {
  //     result = renderHook(() => useLocalStorage(key, defaultValue));
  //   });

  //   expect(result.current[0]).toEqual(defaultValue);
  //   expect(window.localStorage.getItem(key)).toBeNull();

  //   await new Promise<void>((resolve) => setTimeout(resolve, 1000));

  //   expect(consoleErrorSpy).toHaveBeenCalledTimes(3);

  //   consoleErrorSpy.mockRestore();

  //   // explicitly unmount the component and clean up its state
  //   await act(async () => {
  //     result.unmount();
  //   });

  //   expect(window.localStorage.getItem(key)).toBeNull();
  // });
});

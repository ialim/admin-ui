import { forwardRef, useCallback, useEffect, useRef } from "react";

type BasicInputProps = JSX.IntrinsicElements["input"];

type InputProps = {
  indeterminate?: any;
} & BasicInputProps;

export const IndeterminateCheckbox = forwardRef<HTMLInputElement, InputProps>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef<HTMLInputElement>(null);
    const resolvedRef = ref || defaultRef;

    const checkRef = useCallback((ref:any) => {
      if(ref.current) {
        ref.current.indeterminate = indeterminate
      }
    },[indeterminate])

    useEffect(() => {
      checkRef(resolvedRef)
    }, [resolvedRef, checkRef]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

IndeterminateCheckbox.displayName = "Checkbox";

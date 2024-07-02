import { MutableRefObject, useRef } from 'react';
import { Span } from '@opentelemetry/api';

export type SpanRef = MutableRefObject<Span | null>;

const useSpan = (): SpanRef => {
  const spanRef = useRef<Span | null>(null);
  return spanRef;
};

export default useSpan;

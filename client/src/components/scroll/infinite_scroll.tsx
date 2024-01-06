//参考：https://github.com/ankeetmaini/react-infinite-scroll-component/tree/master
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ThresholdUnits, parseThreshold } from "./thread_hold";
import { throttle } from "throttle-debounce";

type Fn = () => any;
interface InfiniteScrollProps {
  next: Fn;
  hasMore: boolean;
  children: ReactNode;
  loader: ReactNode;
  scrollThreshold?: number | string;
  endMessage?: ReactNode;
  className?: string;
  height?: number | string;
  scrollableTarget?: ReactNode;
  inverse?: boolean;
  onScroll?: (e: MouseEvent) => any;
  dataLength: number;
  initialScrollY?: number;
}

export default function InfiniteScroll(props: InfiniteScrollProps) {
  // console.log("infinite scroll render", props.dataLength);
  const list_ref = useRef(null);
  const propsRef = useRef(props);
  const scroll_ref = useRef<HTMLElement | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const actionTriggered = useRef(false);
  const getScrollableTarget = () => {
    if (props.scrollableTarget instanceof HTMLElement) return props.scrollableTarget;
    if (typeof props.scrollableTarget === "string") {
      const res = document.getElementById(props.scrollableTarget);
      return res;
    }
    if (props.scrollableTarget === null) {
      console.warn("scrollbar target not find");
    }
    return null;
  };
  useEffect(() => {
    propsRef.current = { ...props };
  }, [props]);
  useEffect(() => {
    actionTriggered.current = false;
    setShowLoader(false);
  }, [props.dataLength]);

  function isElementAtTop(target: HTMLElement, scrollThreshold: string | number = 0.2) {
    const clientHeight =
      target === document.body || target === document.documentElement ? window.screen.availHeight : target.clientHeight;
    const threshold = parseThreshold(scrollThreshold);
    // console.log(
    //   `top:${target.scrollTop} clienth:${clientHeight} threshold:${threshold.value} unit:${threshold.unit} scrollheight:${target.scrollHeight}`
    // );
    if (threshold.unit === ThresholdUnits.Pixel) {
      return target.scrollTop <= threshold.value + 1;
    }
    const max_top = (threshold.value / 100) * target.scrollHeight;
    return target.scrollTop < max_top + 1;
  }

  function isElementAtBottom(target: HTMLElement, scrollThreshold: string | number = 0.2) {
    const clientHeight =
      target === document.body || target === document.documentElement ? window.screen.availHeight : target.clientHeight;
    const threshold = parseThreshold(scrollThreshold);
    if (threshold.unit === ThresholdUnits.Pixel) {
      return target.scrollHeight - target.scrollTop - clientHeight <= threshold.value;
    }
    const max_bottom = (threshold.value / 100) * target.scrollHeight;
    return target.scrollHeight - target.scrollTop - clientHeight <= max_bottom;
  }

  const onScrollListener = useCallback((event: MouseEvent) => {
    const props = propsRef.current;
    if (typeof props.onScroll === "function") {
      // Execute this callback in next tick so that it does not affect the
      // functionality of the library.
      setTimeout(() => props.onScroll && props.onScroll(event), 0);
    }
    if (scroll_ref.current != null) {
      const target = scroll_ref.current;
      // return immediately if the action has already been triggered,
      // prevents multiple triggers.
      if (actionTriggered.current) return;
      const atBottom = props.inverse
        ? isElementAtTop(target, props.scrollThreshold)
        : isElementAtBottom(target, props.scrollThreshold);

      // console.log("scroll at bottom", atBottom, "has more", props.hasMore);
      // call the `next` function in the props to trigger the next data fetch
      if (atBottom && props.hasMore) {
        actionTriggered.current = true;
        setShowLoader(true);
        props.next && props.next();
      }
    }
  }, []);
  useEffect(() => {
    if (typeof props.dataLength === "undefined") {
      throw new Error(
        `mandatory prop "dataLength" is missing. The prop is needed` + ` when loading more content. Check README.md for usage`
      );
    }
    let _scrollableNode = getScrollableTarget();
    scroll_ref.current = props.height ? list_ref.current : _scrollableNode;
    if (
      typeof props.initialScrollY === "number" &&
      scroll_ref.current &&
      scroll_ref.current instanceof HTMLElement &&
      scroll_ref.current.scrollHeight > props.initialScrollY
    ) {
      scroll_ref.current.scrollTo(0, props.initialScrollY);
    }
  }, []);
  useEffect(() => {
    const throttle_listener = throttle(150, onScrollListener) as (
      event: MouseEvent
    ) => void as EventListenerOrEventListenerObject;
    if (scroll_ref.current) {
      // console.log("add scroll listener", scroll_ref.current);
      scroll_ref.current.addEventListener("scroll", throttle_listener);
    }
    return () => {
      if (scroll_ref.current) {
        // console.log("render infite scroll destory", scroll_ref.current);
        scroll_ref.current.removeEventListener("scroll", throttle_listener);
      }
    };
  }, []);
  return (
    <div className={props.className}>
      <div ref={list_ref} style={{ height: props.height || "auto", overflow: "auto", WebkitOverflowScrolling: "touch" }}>
        {props.inverse && showLoader && props.hasMore && props.loader}
        {props.inverse && !props.hasMore && props.endMessage}
        {props.children}
        {!props.inverse && showLoader && props.hasMore && props.loader}
        {!props.inverse && !props.hasMore && props.endMessage}
      </div>
    </div>
  );
}

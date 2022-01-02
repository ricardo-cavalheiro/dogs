import { useState, useEffect } from 'react'

function useInfiniteScroll(targetElement: string) {
  const [shouldLoadMoreItems, setShouldLoadMoreItems] = useState(false)

  useEffect(() => {
    let observer: IntersectionObserver

    const target = document.querySelector(targetElement)
    const options: IntersectionObserverInit = {
      root: null,
      threshold: 0.8,
    }
    const callback: IntersectionObserverCallback = (entries) => {
      entries[0].isIntersecting
        ? setShouldLoadMoreItems(true)
        : setShouldLoadMoreItems(false)
    }

    observer = new IntersectionObserver(callback, options)

    if (target) observer.observe(target)

    return () => observer.disconnect()
  }, [])

  return { shouldLoadMoreItems }
}

export { useInfiniteScroll }

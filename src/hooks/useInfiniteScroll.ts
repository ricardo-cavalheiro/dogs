import { useState, useEffect } from 'react'

function useInfiniteScroll() {
  const [shouldLoadMoreItems, setShouldLoadMoreItems] = useState(false)

  useEffect(() => {
    const target = document.querySelector('footer')
    const options: IntersectionObserverInit = {
      root: null,
      threshold: 0.2,
    }
    const callback: IntersectionObserverCallback = (entries) => {
      entries[0].isIntersecting
        ? setShouldLoadMoreItems(true)
        : setShouldLoadMoreItems(false)
    }

    const observer = new IntersectionObserver(callback, options)

    if (target) {
      observer.observe(target)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return { shouldLoadMoreItems }
}

export { useInfiniteScroll }

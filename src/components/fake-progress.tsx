import { useEffect, useState } from 'react'
import { Progress } from './ui/progress'

export function FakeProgress() {
  /*     let p = 1;
    const [progress, setProgress] = useState(p)
    let timer: NodeJS.Timeout;
 
    useEffect(() => {
      timer = setInterval(() => {
        if (p >= 98) {
            clearInterval(timer)
            return
        }
        p += 90 - p / 2;
        setProgress(p)
        return () => clearInterval(timer)
      }, 100)
    }, [])

    useEffect(() => {
        return () => {
            clearInterval(timer)
        }
    }, []) */

  return (
    <>
      <div className='flex items-center gap-2'>
        <img
          style={{mixBlendMode: 'lighten'}}
          src='https://cdn.dribbble.com/userupload/10543014/file/original-4703d0ba72b72f87fa49a618a24a1f6d.gif'
          width='150'
          className='m-auto'
        />
      </div>
      <h3 className='w-full text-center'>Searching the meaning of life...</h3>
    </>
  )

  {
    /* <Progress value={progress} /> */
  }
}

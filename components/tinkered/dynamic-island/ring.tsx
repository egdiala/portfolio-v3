"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, type Transition } from "motion/react"
import { useTimeScale } from "@/components/playground/time-scale"

const SHAKE = [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0]
const SETTLE = [0, -15, 5, -2, 0]
const CLAPPER_SHAKE = [0, 7, -6, 5, -5, 4, -4, 2, -2, 1, -1, 0]
const CLAPPER_SETTLE = [0, 2, -2, 0]

const label = {
  initial: { opacity: 0, filter: "blur(4px)", scale: 0.25 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, filter: "blur(4px)", scale: 0.25 },
}

const pill = {
  shown: { scaleX: 1, opacity: 1, filter: "blur(0px)" },
  hidden: { scaleX: 0, opacity: 0, filter: "blur(4px)" },
}

/**
 * The width jumps between Ring and Silent and the island's layout animation
 * morphs it on `resize`. The parts inside animate position only, on the same
 * spring, so they glide to their new spots instead of stretching.
 */
export function Ring({ resize }: Readonly<{ resize: Transition }>) {
  const time = useTimeScale()
  const [silent, setSilent] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setSilent((current) => !current), time.ms(2000))
    return () => clearTimeout(id)
  }, [silent, time])

  const shake = time.transition({ type: "keyframes", duration: 0.8, ease: [0.25, 0.1, 0.35, 1] })
  const labelTransition = time.transition({ type: "spring", duration: 0.3, bounce: 0 })

  return (
    <div
      style={{ width: silent ? 148 : 128 }}
      className="relative flex h-7 items-center justify-between px-2.5"
    >
      {/* Stays mounted: unmounting a layout node in the island's LayoutGroup makes the next resize snap.
          The scale lives on the child so the layout node is never measured at scaleX 0. */}
      <motion.div layout="position" transition={{ layout: resize }} className="absolute left-[5px] h-[18px] w-10">
        <motion.div
          initial={false}
          animate={silent ? pill.shown : pill.hidden}
          transition={time.transition({ type: "spring", bounce: 0.35 })}
          className="size-full rounded-full bg-[#FD4F30]"
        />
      </motion.div>

      <motion.div
        layout="position"
        initial={false}
        animate={{ rotate: silent ? SETTLE : SHAKE, x: silent ? 9 : 0 }}
        transition={{
          rotate: shake,
          x: time.transition({ type: "spring", duration: 0.4, bounce: 0.3 }),
          layout: resize,
        }}
        className="relative h-[12.75px] w-[11.25px]"
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0"
          width="11.25"
          height="12.75"
          viewBox="0 0 15 17"
          fill="none"
        >
          <path
            d="M1.17969 13.3125H13.5625C14.2969 13.3125 14.7422 12.9375 14.7422 12.3672C14.7422 11.5859 13.9453 10.8828 13.2734 10.1875C12.7578 9.64844 12.6172 8.53906 12.5547 7.64062C12.5 4.64062 11.7031 2.57812 9.625 1.82812C9.32812 0.804688 8.52344 0 7.36719 0C6.21875 0 5.40625 0.804688 5.11719 1.82812C3.03906 2.57812 2.24219 4.64062 2.1875 7.64062C2.125 8.53906 1.98438 9.64844 1.46875 10.1875C0.789062 10.8828 0 11.5859 0 12.3672C0 12.9375 0.4375 13.3125 1.17969 13.3125Z"
            fill="white"
          />
          <motion.path
            initial={false}
            animate={{ x: silent ? CLAPPER_SETTLE : CLAPPER_SHAKE }}
            transition={shake}
            d="M4.97656 14.3828C5.07812 15.4766 6.04688 16.4453 7.36719 16.4453C8.69531 16.4453 9.66406 15.4766 9.76562 14.3828H4.97656Z"
            fill="white"
          />
        </svg>
        {silent ? (
          <div className="absolute inset-0">
            <div className="h-5 translate-x-[5px] -translate-y-[5px] rotate-[-40deg] overflow-hidden">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={time.transition({ type: "tween", ease: "easeInOut", duration: 0.125, delay: 0.15 })}
                className="h-4 w-fit origin-top"
              >
                <div className="flex h-full w-[3px] items-center justify-center rounded-full bg-[#FD4F30]">
                  <div className="h-full w-[0.75px] rounded-full bg-white" />
                </div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </motion.div>

      <motion.div layout="position" transition={{ layout: resize }} className="ml-auto flex items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {silent ? (
            <motion.span
              key="silent"
              {...label}
              transition={labelTransition}
              className="text-xs font-medium text-[#FD4F30]"
            >
              Silent
            </motion.span>
          ) : (
            <motion.span
              key="ring"
              {...label}
              transition={labelTransition}
              style={{ originX: 1 }}
              className="text-xs font-medium text-white"
            >
              Ring
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

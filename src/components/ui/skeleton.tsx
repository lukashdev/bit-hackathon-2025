import { Skeleton as ChakraSkeleton, SkeletonProps as ChakraSkeletonProps } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface SkeletonProps extends ChakraSkeletonProps {
  noOfLines?: number
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ noOfLines = 1, ...props }, ref) {
    return (
      <ChakraSkeleton
        ref={ref}
        {...props}
      />
    )
  },
)

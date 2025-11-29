"use client"

import type { InputProps } from "@chakra-ui/react"
import {
  HStack,
  IconButton,
  Input,
  mergeRefs,
  useControllableState,
} from "@chakra-ui/react"
import * as React from "react"
import { LuEye, LuEyeOff } from "react-icons/lu"

export interface PasswordVisibilityProps {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}

export interface PasswordInputProps
  extends InputProps,
    PasswordVisibilityProps {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const {
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
      ...rest
    } = props

    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    })

    const inputRef = React.useRef<HTMLInputElement>(null)

    return (
      <HStack gap="0" width="full" position="relative">
        <Input
          {...rest}
          ref={mergeRefs(ref, inputRef)}
          type={visible ? "text" : "password"}
          paddingEnd="10"
        />
        <IconButton
          variant="ghost"
          aria-label={visible ? "Hide password" : "Show password"}
          display="flex"
          position="absolute"
          right="2"
          zIndex="5"
          size="xs"
          onClick={() => {
            setVisible(!visible)
            inputRef.current?.focus({ preventScroll: true })
          }}
          color="fg.muted"
        >
          {visible ? visibilityIcon.off : visibilityIcon.on}
        </IconButton>
      </HStack>
    )
  },
)

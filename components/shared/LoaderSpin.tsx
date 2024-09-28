import Image from 'next/image'
import React from 'react'

const LoaderSpin = ({ size }:{ size: number }) => {
  return (
    <Image src={`/icons/loadingspin.svg`} width={size} height={size} alt='loading spin icon' />
  )
}

export default LoaderSpin
import Button from '@/atomics/button';
import { useRouter } from 'next/router';
import React from 'react'

export default function OrderCreated() {
  const router = useRouter();
  return (
    <main className="h-screen flex justify-center items-center flex-col" >
      <div className="flex text-center">Order is created</div>
      <br />
      <div className="flex justify-end">
        <Button onClick={() => router.push(`/`)}>Back to Home</Button>
      </div>
    </main>
  )
}

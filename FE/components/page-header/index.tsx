import React from 'react'

interface PageHeaderProps {
  title: string;
}
export default function PageHeader({title}: PageHeaderProps) {
  return (
    <div className="font-bold font-xl sticky top-0 text-center py-4 bg-blue-300">{title}</div>
  )
}

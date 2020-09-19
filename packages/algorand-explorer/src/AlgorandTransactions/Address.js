import React from 'react'

import { Link } from 'react-router-dom'

export default function Address ({ addr }) {
  if (!addr) {
    return null
  }
  return (
    <Link to={`/account/${addr}`} className='text-body small'>
      <code>{addr.substr(0, 8)}...{addr.substr(50, 58)}</code>
    </Link>
  )
}

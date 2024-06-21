import React from 'react'
import { createThirdwebClient } from 'thirdweb';


const client = () => {
  return (
    createThirdwebClient({ clientId:  "d9645be90e76e6cbe5cbec979d06290a"})
  )
}

export default client
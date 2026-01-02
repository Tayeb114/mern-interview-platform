import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import React from 'react'

const App = () => {
  return (
    <div>
      <h1>welcome to the app</h1>

      <SignedOut>
            <SignInButton mode="modal">
              <button className=''>Login</button>
            </SignInButton>
      </SignedOut>

<SignedIn>
  <SignOutButton/>
</SignedIn>

<UserButton/>

  
    </div>
  )
}

export default App
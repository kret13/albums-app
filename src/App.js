import * as React from 'react'
import {useAuth} from './context/AuthContext'
import {FullPageSpinner} from './components/lib'

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './AuthenticatedApp'),
)
const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'))

function App() {
  const {user} = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}

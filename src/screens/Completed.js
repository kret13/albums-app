import * as React from 'react'
import {Link} from 'components/lib'
import {ListItemList} from 'components/ListItemList'

function CompletedScreen() {
  return (
    <ListItemList
      filterListItems={li => Boolean(li.finishDate)}
      noListItems={
        <p>
          Hey there! This is where albums will go when you've completed listening
          them. Get started by heading over to{' '}
          <Link to="/discover">the Discover page</Link> to add albums to your
          list.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you've got some listening to do! Check them out in your{' '}
          <Link to="/list">listening list</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  )
}

export {CompletedScreen}

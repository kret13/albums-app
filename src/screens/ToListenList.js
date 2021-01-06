import * as React from 'react'
import {Link} from 'components/lib'
import {ListItemList} from 'components/ListItemList'

function ToListenScreen() {
  return (
    <ListItemList
      filterListItems={li => !li.finishDate}
      noListItems={
        <p>
          Hey there! Welcome to your albums listening list. Get started by
          heading over to <Link to="/discover">the Discover page</Link> to add
          albums to your list.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you've completed listening all your albums! Check them out in your{' '}
          <Link to="/completed">completed albums</Link> or{' '}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  )
}

export {ToListenScreen}

/** @jsx jsx */
import {jsx} from '@emotion/core'

import {useListItems} from 'utils/list-items'
import {AlbumListUL} from './lib'
import {AlbumRow} from './AlbumRow'
import {Profiler} from './Profiler'

function ListItemList({filterListItems, noListItems, noFilteredListItems}) {
  const listItems = useListItems()

  const filteredListItems = listItems.filter(filterListItems)

  if (!listItems.length) {
    return <div css={{marginTop: '1em', fontSize: '1.2em'}}>{noListItems}</div>
  }
  if (!filteredListItems.length) {
    return (
      <div css={{marginTop: '1em', fontSize: '1.2em'}}>
        {noFilteredListItems}
      </div>
    )
  }

  return (
    <Profiler
      id="List Item List"
      metadata={{listItemCount: filteredListItems.length}}
    >
      <AlbumListUL>
        {filteredListItems.map(listItem => (
          <li key={listItem.id} aria-label={listItem.album.title}>
            <AlbumRow album={listItem.album} />
          </li>
        ))}
      </AlbumListUL>
    </Profiler>
  )
}

export {ListItemList}

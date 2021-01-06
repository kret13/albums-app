/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link} from 'react-router-dom'
import {useListItem} from 'utils/list-items'
import * as colors from 'styles/colors'
import {StatusButtons} from './StatusButtons'
import {Rating} from './Rating'

function AlbumRow({album}) {
  const {title, artist, coverImageUrl} = album
  const listItem = useListItem(album.id)

  const id = `album-row-album-${album.id}`

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      <Link
        aria-labelledby={id}
        to={`/album/${album.id}`}
        css={{
          minHeight: 270,
          flexGrow: 2,
          border: `1px solid ${colors.gray20}`,
          color: colors.text,
          padding: '1.25em',
          borderRadius: '3px',
          ':hover,:focus': {
            textDecoration: 'none',
            boxShadow: '0 5px 15px -5px rgba(0,0,0,.08)',
            color: 'inherit',
          },
        }}
      >
        <div
          css={{
            width: '100%',
            display: 'flex'
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} album cover`}
            css={{maxHeight: '100%', width: '40%', marginRight:'auto'}}
          />
          <div
            css={{
              textAlign: 'right',
              fontStyle: 'italic',
              fontSize: '0.85em',
            }}
          >
            {artist}<br/>{album.genre}
          </div>
        </div>
        <div css={{flex: 1}}>
          <div css={{display: 'flex', justifyContent: 'space-between'}}>
            <div css={{flex: 1}}>
              <h2
                id={id}
                css={{
                  fontSize: '1.25em',
                  margin: '0',
                  color: colors.yellowDarken10,
                }}
              >
                {title}
              </h2>
              {listItem?.finishDate ? <Rating listItem={listItem} /> : null}
            </div>

          </div>
          <small css={{whiteSpace: 'break-spaces', display: 'block'}}>
            {album.about.substring(0, 500)}...
          </small>
        </div>
      </Link>
      <div
        css={{
          marginLeft: '20px',
          position: 'absolute',
          right: -20,
          color: colors.gray80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
        }}
      >
        <StatusButtons album={album} />
      </div>
    </div>
  )
}

export {AlbumRow}

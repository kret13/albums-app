/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import * as colors from 'styles/colors'
import {useAlbumSearch, useRefetchAlbumSearchQuery} from 'utils/albums'
import {AlbumRow} from 'components/AlbumRow'
import {AlbumListUL, Spinner, Input} from 'components/lib'
import {Profiler} from 'components/Profiler'

function DiscoverAlbumsScreen() {
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState()
  const {albums, error, isLoading, isError, isSuccess} = useAlbumSearch(query)
  
  const refetchAlbumSearchQuery = useRefetchAlbumSearchQuery()

  React.useEffect(() => {
    return () => refetchAlbumSearchQuery()
  }, [refetchAlbumSearchQuery])

  function handleSearchClick(event) {
    event.preventDefault()
    setQueried(true)
    setQuery(event.target.elements.search.value)
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSearchClick}>
          <Input
            placeholder="Search albums..."
            id="search"
            type="search"
            css={{width: '100%'}}
          />
          <Tooltip label="Search albums">
            <label htmlFor="search">
              <button
                type="submit"
                css={{
                  border: '0',
                  position: 'relative',
                  marginLeft: '-35px',
                  background: 'transparent',
                }}
              >
                {isLoading ? (
                  <Spinner />
                ) : isError ? (
                  <FaTimes aria-label="error" css={{color: colors.danger}} />
                ) : (
                  <FaSearch aria-label="search" />
                )}
              </button>
            </label>
          </Tooltip>
        </form>

        {isError ? (
          <div css={{color: colors.danger}}>
            <p>There was an error:</p>
            <pre>{error.message}</pre>
          </div>
        ) : null}
      </div>
      <div>
        {queried ? null : (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            <p>Welcome to the discover page.</p>
            <p>Here, let me load a few albums for you...</p>
            {isLoading ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : isSuccess && albums.length ? (
              <p>Here you go! Find more albums with the search bar above.</p>
            ) : isSuccess && !albums.length ? (
              <p>
                Hmmm... I couldn't find any albums to suggest for you. Sorry.
              </p>
            ) : null}
          </div>
        )}
        {albums.length ? (
          <Profiler
            id="Discover albums Screen Album List"
            metadata={{query, albumCount: albums.length}}
          >
            <AlbumListUL css={{marginTop: 20}}>
              {albums.map(album => (
                <li key={album.id} aria-label={album.title}>
                  <AlbumRow key={album.id} album={album} />
                </li>
              ))}
            </AlbumListUL>
          </Profiler>
        ) : queried ? (
          <div css={{marginTop: 20, fontSize: '1.2em', textAlign: 'center'}}>
            {isLoading ? (
              <div css={{width: '100%', margin: 'auto'}}>
                <Spinner />
              </div>
            ) : (
              <p>
                Hmmm... I couldn't find any albums with the query "{query}."
                Please try another.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export {DiscoverAlbumsScreen}

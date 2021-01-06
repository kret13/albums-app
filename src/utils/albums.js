import * as React from 'react'
import {useQuery, queryCache} from 'react-query'
import {useAuthenticatedClient} from 'context/AuthContext'
import albumPlaceholderSvg from 'assets/album-placeholder.svg'

const loadingAlbum = {
  title: 'Loading...',
  artist: 'loading...',
  coverImageUrl: albumPlaceholderSvg,
  genre: 'Loading Publishing',
  about: 'Loading...',
  loadingAlbum: true,
}

const loadingAlbums = Array.from({length: 10}, (v, index) => ({
  id: `loading-album-${index}`,
  ...loadingAlbum,
}))

const albumQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

const getAlbumSearchConfig = (client, query) => ({
  queryKey: ['albumSearch', {query}],
  queryFn: () =>
    client(`albums?query=${encodeURIComponent(query)}`).then(data => data.albums),
  config: {
    onSuccess(albums) {
      for (const album of albums) {
        queryCache.setQueryData(
          ['album', {albumId: album.id}],
          album,
          albumQueryConfig,
        )
      }
    },
  },
})

function useAlbumSearch(query) {
  const client = useAuthenticatedClient()
  const result = useQuery(getAlbumSearchConfig(client, query))
  return {...result, albums: result.data ?? loadingAlbums}
}

function useAlbum(albumId) {
  const client = useAuthenticatedClient()
  const {data} = useQuery({
    queryKey: ['album', {albumId}],
    queryFn: () => client(`albums/${albumId}`).then(data => data.album),
    ...albumQueryConfig,
  })
  return data ?? loadingAlbum
}

function useRefetchAlbumSearchQuery() {
  const client = useAuthenticatedClient()
  return React.useCallback(
    async function refetchAlbumSearchQuery() {
      queryCache.removeQueries('albumSearch')
      await queryCache.prefetchQuery(getAlbumSearchConfig(client, ''))
    },
    [client],
  )
}

function setQueryDataForAlbum(album) {
  queryCache.setQueryData({
    queryKey: ['album', {albumId: album.id}],
    queryFn: album,
    ...albumQueryConfig,
  })
}

export {useAlbum, useAlbumSearch, useRefetchAlbumSearchQuery, setQueryDataForAlbum}

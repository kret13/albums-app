import {useQuery, useMutation, queryCache} from 'react-query'
import {setQueryDataForAlbum} from './albums'
import {useAuthenticatedClient} from 'context/AuthContext'

function useListItem(albumId, options) {
  const listItems = useListItems(options)
  return listItems?.find(li => li.albumId === albumId) ?? null
}

function useListItems({onSuccess, ...options} = {}) {
  const client = useAuthenticatedClient()

  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items').then(data => data.listItems),
    onSuccess: async listItems => {
      await onSuccess?.(listItems)
      for (const listItem of listItems) {
        setQueryDataForAlbum(listItem.album)
      }
    },
    ...options,
  })
  return listItems ?? []
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function onUpdateMutation(newItem) {
  const previousItems = queryCache.getQueryData('list-items')

  queryCache.setQueryData('list-items', old => {
    return old.map(item => {
      return item.id === newItem.id ? {...item, ...newItem} : item
    })
  })

  return () => queryCache.setQueryData('list-items', previousItems)
}

function useUpdateListItem(options) {
  const client = useAuthenticatedClient()

  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
      }),
    { 
      onMutate:
      onUpdateMutation, 
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useRemoveListItem(options) {
  const client = useAuthenticatedClient()

  return useMutation(({id}) => client(`list-items/${id}`, {method: 'DELETE'}), {
    onMutate: removedItem => {
      const previousItems = queryCache.getQueryData('list-items')

      queryCache.setQueryData('list-items', old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutationOptions,
    ...options,
  })
}

function useCreateListItem(options) {
  const client = useAuthenticatedClient()

  return useMutation(({albumId}) => client('list-items', {data: {albumId}}), {
    ...defaultMutationOptions,
    ...options,
  })
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}

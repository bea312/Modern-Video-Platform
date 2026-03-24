import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchFromAPI } from '../api/fetchFromAPI'
import VideoCard from '../components/Media/VideoCard'
import Loader from '../components/Feedback/Loader'

const Feed = ({ selectedCategory }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', selectedCategory],
    queryFn: () => fetchFromAPI(`search?query=${selectedCategory}&type=video`),
  })

  if (isLoading) return <Loader />
  if (error) return <div className="text-center text-red-500">Error loading videos</div>

  return (
    <div>
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {['All', 'Music', 'Gaming', 'News'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 bg-gray-800 rounded-full whitespace-nowrap hover:bg-gray-700"
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.data?.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  )
}

export default Feed
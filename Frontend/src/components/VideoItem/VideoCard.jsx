import React from 'react'

function VideoCard({ _id, thumbnail, duration, avatar, title, views, timeAgo, author }) {
  return (
    <div className="w-full">
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          <img
          src={thumbnail}
          alt={title}
          className="h-full w-full" />
        </div>
        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">{duration}</span>
      </div>

      <div className="flex gap-x-2">
        <div className="h-10 w-10 shrink-0">
          <img
          src={avatar}
          alt={author}
          className="h-full w-full rounded-full" />
        </div>
        <div className="w-full">
          <h6 className="mb-1 font-semibold">{title}</h6>
          <p className="flex text-sm text-gray-200">{views} Views · {timeAgo}</p>
          <p className="text-sm text-gray-200">{author}</p>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
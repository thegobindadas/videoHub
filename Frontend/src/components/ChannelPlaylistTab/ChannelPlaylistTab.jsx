import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderIcon } from "../../assets";
import { Loader, NoContentMessage, ChannelPlaylistTabCard } from "../index";
import { useDispatch, useSelector } from 'react-redux';
import { setPlaylists, setLoading, setError, setPage, setHasMore, resetPlaylists } from '../../store/channelPlaylistSlice';
import playlistService from "../../services/playlistService";



function ChannelPlaylistTab({ channelId }) {

  const dispatch = useDispatch();
  const { playlists, loading, error, page, hasMore } = useSelector((state) => state.channelPlaylists);
  const loader = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const noContentMessages = {
    title: "No playlist created",
    text: "There are no playlist created on this channel.",
  };



  const fetchChannelPlaylists = useCallback(async () => {
    try {
      if (page === 1) {
        dispatch(setLoading(true));
      } else {
        setLoadingMore(true);
      }

      const response = await playlistService.getUserPlaylists({userId: channelId, page});
      const fetchedChannelPlaylists = response.data.playlists;
      setTotalPages(response.data.totalPages);
      dispatch(setHasMore(page < response.data.totalPages));
      dispatch(setPlaylists(fetchedChannelPlaylists));      
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
      setLoadingMore(false);
    }
  }, [channelId, page, dispatch]);

  
  useEffect(() => {
    if (page <= totalPages) {
      fetchChannelPlaylists();
    }
  }, [fetchChannelPlaylists, page, totalPages]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          dispatch(setPage(page + 1));
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, dispatch, page]);


  useEffect(() => {
    dispatch(resetPlaylists());
    dispatch(setPage(1));
  }, [channelId, dispatch]);





  if (loading) return <Loader msg="playlists" />;
  if (error) return <div>Error: {error}</div>;
  if (!playlists.length) {
    return (
      <div className="flex justify-center p-4">
        <NoContentMessage Icon={FolderIcon} message={noContentMessages} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
      {playlists.map((playlist) => (
        <Link key={playlist._id} to={`/playlist/${playlist._id}`}>
          <ChannelPlaylistTabCard 
            playlist={playlist}
          />
        </Link>
      ))}
      {page >= totalPages && (
        <p className="text-center text-gray-500">No more playlists to load.</p>
      )}
      <div ref={loader} className="loader"></div>
    </div>
  )
}


export default ChannelPlaylistTab
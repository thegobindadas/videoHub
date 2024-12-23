import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Loader, NoContentMessage, ChannelVideoTabCrad, VideoUploadModal } from "../index"
import { VideoIcon, PlusIcon } from "../../assets"
import { setVideos, setLoading, setError, setPage, setHasMore, resetVideos } from '../../store/channelVideoSlice';
import { useDispatch, useSelector } from 'react-redux';
import videoServices from "../../services/videoServices"
import { Link } from 'react-router-dom';


function MyChannelVideoTab({ channelId }) {

    const dispatch = useDispatch();
    const { videos, loading, error, page, hasMore } = useSelector((state) => state.channelVideos);
    const loader = useRef(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);



    const fetchChannelVideos = useCallback(async () => {
        try {
            if (page === 1) {
                dispatch(setLoading(true));
            } else {
                setLoadingMore(true);
            }

            const response = await videoServices.getChannelVideos(channelId, page);
            const fetchedChannelVideos = response.data.videos;
            setTotalPages(response.data.totalPages);
            dispatch(setHasMore(page < response.data.totalPages));
            dispatch(setVideos(fetchedChannelVideos));
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
            setLoadingMore(false);
        }
    }, [channelId, page, dispatch]);


    useEffect(() => {
        if (page <= totalPages) {
            fetchChannelVideos();
        }
    }, [fetchChannelVideos, page, totalPages]);


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

        return () => observer.disconnect(); // cleanup observer on unmount
    }, [hasMore, loading, loadingMore, dispatch, page]);


    useEffect(() => {
        dispatch(resetVideos());
        dispatch(setPage(1));
    }, [channelId, dispatch]);

    const handleNewVideoClick = () => {
        setIsModalOpen(true); 
    };
    
      


    const noContentMessages = {
        title: "No videos uploaded",
        text: "This page has yet to upload a video. Search another page in order to find more videos.",
    };


    if (loading) return <Loader msg="videos" />;
    if (error) return <div>Error: {error}</div>;
    if (!videos.length) {
        return (
            <div className="flex justify-center p-4">
                <NoContentMessage
                    Icon={VideoIcon}
                    message={noContentMessages}
                    actionButton={{
                        label: "New video",
                        Icon: PlusIcon,
                        onClick: handleNewVideoClick,
                    }}
                />

                {isModalOpen && (
                    <VideoUploadModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
            {videos.map((video) => (
                <Link to={`/watch/${video._id}`} key={video._id}>
                    <ChannelVideoTabCrad
                        thumbnail={video.thumbnail}
                        title={video.title}
                        duration={video.duration}
                        views={video.views}
                        createdAt={video.createdAt}
                    />
                </Link>
            ))}
            {page >= totalPages && (
                <p className="text-center text-gray-500">No more videos to load.</p>
            )}
            <div ref={loader} className="loader"></div>
        </div>
    );
}


export default MyChannelVideoTab
import React, { useEffect, useRef, useCallback } from "react";
import { useAppBar } from "@/components/ui/AppBarContext";
import { PostListItem } from "@/components/ui/PostListItem";
import { useInfinitePosts } from "@/hooks/useInfinitePosts";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { House, Camera } from "phosphor-react";

export function HomeScreen() {
  const { setAppBarContent } = useAppBar();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const {
    posts,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMorePosts,
    updatePost,
    refresh
  } = useInfinitePosts({
    type: 'feed',
    limit: 10
  });

  // Intersection Observer para carregamento infinito
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMorePosts();
      }
    });

    if (node) {
      observerRef.current.observe(node);
    }
  }, [loadingMore, hasMore, loadMorePosts]);

  // Cleanup do observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLikeChange = (postId: string, isLiked: boolean) => {
    updatePost(postId, {
      likeCount: isLiked ? (posts.find(p => p.id === postId)?.likeCount || 0) + 1 : 
                          Math.max(0, (posts.find(p => p.id === postId)?.likeCount || 0) - 1)
    });
  };

  const handleCommentClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/profile/${tag}`);
  };

  if (!authUser) {
    return (
      <div className="ppm:flex ppm:items-center ppm:justify-center ppm:h-full">
        <div className="ppm:text-center ppm:space-y-4">
          <House className="ppm:w-16 ppm:h-16 ppm:text-gray-400 ppm:mx-auto" />
          <h2 className="ppm:text-xl ppm:font-semibold ppm:text-gray-900">
            Faça login para ver posts
          </h2>
          <p className="ppm:text-gray-600">
            Entre na sua conta para ver posts de pessoas que você segue.
          </p>
        </div>
      </div>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <div className="ppm:space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="ppm:bg-white ppm:border-b ppm:border-gray-200">
            <div className="ppm:p-3 ppm:flex ppm:items-center ppm:gap-3">
              <div className="ppm:w-8 ppm:h-8 ppm:bg-gray-200 ppm:rounded-full ppm:animate-pulse" />
              <div className="ppm:flex-1 ppm:space-y-2">
                <div className="ppm:h-4 ppm:bg-gray-200 ppm:rounded ppm:animate-pulse" />
                <div className="ppm:h-3 ppm:bg-gray-200 ppm:rounded ppm:animate-pulse ppm:w-1/2" />
              </div>
            </div>
            <div className="ppm:aspect-square ppm:bg-gray-200 ppm:animate-pulse" />
            <div className="ppm:p-3 ppm:space-y-2">
              <div className="ppm:h-4 ppm:bg-gray-200 ppm:rounded ppm:animate-pulse" />
              <div className="ppm:h-3 ppm:bg-gray-200 ppm:rounded ppm:animate-pulse ppm:w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="ppm:flex ppm:items-center ppm:justify-center ppm:h-full">
        <div className="ppm:text-center ppm:space-y-4">
          <House className="ppm:w-16 ppm:h-16 ppm:text-gray-400 ppm:mx-auto" />
          <h2 className="ppm:text-xl ppm:font-semibold ppm:text-gray-900">
            Erro ao carregar posts
          </h2>
          <p className="ppm:text-gray-600">
            {error}
          </p>
          <button
            onClick={refresh}
            className="ppm:px-4 ppm:py-2 ppm:bg-blue-600 ppm:text-white ppm:rounded-md ppm:hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="ppm:flex ppm:items-center ppm:justify-center ppm:h-full">
        <div className="ppm:text-center ppm:space-y-4">
          <House className="ppm:w-16 ppm:h-16 ppm:text-gray-400 ppm:mx-auto" />
          <h2 className="ppm:text-xl ppm:font-semibold ppm:text-gray-900">
            Nenhum post encontrado
          </h2>
          <p className="ppm:text-gray-600">
            Siga algumas pessoas para ver posts na sua timeline.
          </p>
          <button
            onClick={() => navigate("/find")}
            className="ppm:px-4 ppm:py-2 ppm:bg-blue-600 ppm:text-white ppm:rounded-md ppm:hover:bg-blue-700"
          >
            Encontrar pessoas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ppm:space-y-0">
      {posts.map((post, index) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastElementRef : undefined}
        >
          <PostListItem
            post={post}
            onLikeChange={handleLikeChange}
            onCommentClick={handleCommentClick}
            onUserClick={handleUserClick}
            onTagClick={handleTagClick}
          />
        </div>
      ))}
      
      {/* Loading indicator para carregamento infinito */}
      {loadingMore && (
        <div className="ppm:p-4 ppm:text-center">
          <div className="ppm:inline-flex ppm:items-center ppm:gap-2">
            <div className="ppm:animate-spin ppm:rounded-full ppm:h-4 ppm:w-4 ppm:border-b-2 ppm:border-blue-600"></div>
            <span className="ppm:text-sm ppm:text-gray-600">Carregando mais posts...</span>
          </div>
        </div>
      )}
      
      {/* Indicador de fim da lista */}
      {!hasMore && posts.length > 0 && (
        <div className="ppm:p-4 ppm:text-center">
          <span className="ppm:text-sm ppm:text-gray-500">
            Você chegou ao fim da timeline
          </span>
        </div>
      )}
    </div>
  );
} 
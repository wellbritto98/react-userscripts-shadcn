import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ChatCircle,
  PaperPlaneTilt,
  Bookmark,
  DotsThree,
  MapPin,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { PostWithUser } from "@/lib/firestore-models";
import { likeRepository } from "@/lib/repositories";
import { useAuth } from "@/hooks/useAuth";

interface PostListItemProps {
  post: PostWithUser;
  onLikeChange?: (postId: string, isLiked: boolean) => void;
  onCommentClick?: (postId: string) => void;
  onShareClick?: (postId: string) => void;
  onSaveClick?: (postId: string) => void;
  onUserClick?: (username: string) => void;
  onTagClick?: (tag: string) => void;
}

export function PostListItem({
  post,
  onLikeChange,
  onCommentClick,
  onShareClick,
  onSaveClick,
  onUserClick,
  onTagClick,
}: PostListItemProps) {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  // Verificar se o usuário já curtiu o post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!authUser || !post.id) return;
      
      try {
        const hasLiked = await likeRepository.isLiked(authUser.uid, post.id, 'post');
        console.log(`Post ${post.id} - Usuário ${authUser.uid} curtiu:`, hasLiked);
        setIsLiked(hasLiked);
      } catch (error) {
        console.error('Erro ao verificar status do like:', error);
      }
    };

    checkLikeStatus();
  }, [authUser, post.id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | any) => {
    // Garantir que temos um objeto Date válido
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (date && typeof date.toDate === "function") {
      // Firestore Timestamp
      dateObj = date.toDate();
    } else if (date && typeof date.seconds === "number") {
      // Firestore Timestamp como objeto
      dateObj = new Date(date.seconds * 1000);
    } else if (typeof date === "string" || typeof date === "number") {
      // String ou timestamp
      dateObj = new Date(date);
    } else {
      return "Data desconhecida";
    }

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return "Data inválida";
    }

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
    return `${Math.floor(days / 365)} anos atrás`;
  };

  const handleLike = async () => {
    if (!authUser) return;

    try {
      if (isLiked) {
        await likeRepository.unlike(authUser.uid, post.id!, "post");
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
        onLikeChange?.(post.id!, false);
      } else {
        await likeRepository.like(authUser.uid, post.id!, "post");
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        onLikeChange?.(post.id!, true);
      }
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error);
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(post.id!);
    } else {
      navigate(`/post/${post.id}`);
    }
  };

  const handleShareClick = () => {
    onShareClick?.(post.id!);
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    onSaveClick?.(post.id!);
  };

  const handleUserClick = () => {
    if (onUserClick) {
      onUserClick(post.user?.username || "");
    } else {
      navigate(`/profile/${post.user?.username}`);
    }
  };

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    } else {
      navigate(`/profile/${tag}`);
    }
  };

  return (
    <div className="ppm:bg-white ppm:border-b ppm:border-gray-200">
      {/* Header do Post */}
      <div className="ppm:flex ppm:items-center ppm:justify-between ppm:p-3">
        <div className="ppm:flex ppm:items-center ppm:gap-3">
          <Avatar className="ppm:w-8 ppm:h-8">
            <AvatarImage
              src={post.user?.avatarUrl}
              alt={post.user?.displayName || ""}
            />
            <AvatarFallback className="ppm:text-xs">
              {getInitials(post.user?.displayName || "")}
            </AvatarFallback>
          </Avatar>
          <div className="ppm:flex ppm:flex-col">
            <button
              onClick={handleUserClick}
              className="ppm:text-sm ppm:font-semibold ppm:text-gray-900 ppm:text-left ppm:hover:opacity-80"
            >
              {post.user?.username}
            </button>
            {post.location && (
              <span className="ppm:text-xs ppm:text-gray-500 ppm:flex ppm:items-center ppm:gap-1">
                <MapPin className="ppm:w-3 ppm:h-3" />
                {post.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Imagem do Post */}
      <div className="ppm:relative ppm:w-full ppm:aspect-square ppm:bg-gray-100">
        <img
          src={post.imageUrl}
          alt="Post"
          className="ppm:w-full ppm:h-full ppm:object-cover ppm:cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
        />
      </div>

      {/* Ações do Post */}
      <div className="ppm:flex ppm:items-center ppm:justify-between ppm:p-2">
        <div className="ppm:flex ppm:items-center ppm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="ppm:p-1"
          >
            <Heart
              className="ppm:w-6 ppm:h-6"
              weight={isLiked ? "fill" : "regular"}
              color={isLiked ? "#ef4444" : "#000000"}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCommentClick}
            className="ppm:p-1"
          >
            <ChatCircle className="ppm:w-6 ppm:h-6" />
          </Button>
          {/*
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareClick}
            className="ppm:p-1"
          >
            <PaperPlaneTilt className="ppm:w-6 ppm:h-6" />
          </Button>*/}
        </div>
        {/*
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveClick}
          className="ppm:p-1"
        >
          <Bookmark
            className="ppm:w-6 ppm:h-6"
            weight={isSaved ? "fill" : "regular"}
            color={isSaved ? "#3b82f6" : "#000000"}
          />
        </Button>*/}
      </div>

      {/* Likes */}
      {likeCount > 0 && (
        <div className="ppm:px-3 ppm:pb-2">
          <span className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
            {likeCount} curtida{likeCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Caption */}
      {post.caption && (
        <div className="ppm:px-3 ppm:pb-2">
          <div className="ppm:flex ppm:gap-2">
            <span className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
              {post.user?.username}
            </span>
            <span className="ppm:text-sm ppm:text-gray-900">
              {post.caption}
            </span>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="ppm:px-3 ppm:pb-2">
          <div className="ppm:flex ppm:flex-wrap ppm:gap-1">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="ppm:text-xs ppm:cursor-pointer ppm:hover:bg-blue-100"
                onClick={() => handleTagClick(tag)}
              >
                @{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Comentários (limitado a 1 para preview) */}
      {commentCount > 0 && (
        <div className="ppm:px-3 ppm:pb-2">
          <span onClick={() => navigate(`/post/${post.id}`)} className="ppm:text-sm ppm:text-gray-500">
            Ver todos os {commentCount} comentário
            {commentCount !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Data do Post */}
      <div className="ppm:px-3 ppm:pb-3">
        <span className="ppm:text-xs ppm:text-gray-500">
          {formatDate(post.createdAt)}
        </span>
      </div>
    </div>
  );
}

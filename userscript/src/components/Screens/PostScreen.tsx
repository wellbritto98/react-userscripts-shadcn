import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useAppBar } from "@/components/ui/AppBarContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { postRepository } from "@/lib/repositories";
import { commentRepository } from "@/lib/repositories";
import { likeRepository } from "@/lib/repositories";
import { userRepository } from "@/lib/repositories";
import { Post, PostWithUser, Comment, CommentWithUser } from "@/lib/firestore-models";
import { 
  ArrowLeft, 
  Heart, 
  ChatCircle, 
  PaperPlaneTilt, 
  DotsThree, 
  Bookmark,
  BookmarkSimple,
  Clock,
  MapPin,
  User
} from "phosphor-react";

export function PostScreen() {
  const { postId } = useParams<{ postId: string }>();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { setAppBarContent } = useAppBar();

  const [post, setPost] = useState<PostWithUser | null>(null);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Carregar post
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;

      setLoading(true);
      try {
        const postData = await postRepository.getById(postId);
        if (postData) {
          const user = await userRepository.getById(postData.userId);
          
          // Converter datas do Firestore se necessário
          const postWithUser: PostWithUser = {
            ...postData,
            createdAt: postData.createdAt instanceof Date ? postData.createdAt : 
                      ((postData.createdAt as any)?.toDate ? (postData.createdAt as any).toDate() : new Date(postData.createdAt as any)),
            updatedAt: postData.updatedAt instanceof Date ? postData.updatedAt : 
                      ((postData.updatedAt as any)?.toDate ? (postData.updatedAt as any).toDate() : new Date(postData.updatedAt as any)),
            user: user ? {
              id: user.id!,
              username: user.username,
              avatarUrl: user.avatarUrl,
              displayName: user.displayName
            } : undefined
          };
          setPost(postWithUser);

          // Verificar se o usuário curtiu
          if (authUser) {
            const liked = await likeRepository.isLiked(authUser.uid, postId, 'post');
            setIsLiked(liked);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, authUser]);

  // Carregar comentários
  useEffect(() => {
    const loadComments = async () => {
      if (!postId) return;

      console.log('Carregando comentários para postId:', postId);
      setLoadingComments(true);
      try {
        // Debug: verificar todos os comentários primeiro
        await commentRepository.debugGetAllComments();
        
        const commentsData = await commentRepository.getCommentsByPostWithUser(postId, 50);
        console.log('Comentários carregados:', commentsData);
        
        // Converter datas dos comentários se necessário
        const commentsWithConvertedDates = commentsData.map(comment => ({
          ...comment,
          createdAt: comment.createdAt instanceof Date ? comment.createdAt : 
                    ((comment.createdAt as any)?.toDate ? (comment.createdAt as any).toDate() : new Date(comment.createdAt as any)),
          updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt : 
                    ((comment.updatedAt as any)?.toDate ? (comment.updatedAt as any).toDate() : new Date(comment.updatedAt as any))
        }));
        
        console.log('Comentários com datas convertidas:', commentsWithConvertedDates);
        setComments(commentsWithConvertedDates);
      } catch (error) {
        console.error('Erro ao carregar comentários:', error);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [postId]);

  // Configurar AppBar
  useEffect(() => {
    setAppBarContent(
      <div className="ppm:flex ppm:items-center ppm:justify-between ppm:w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="ppm:p-2"
        >
          <ArrowLeft className="ppm:w-5 ppm:h-5" />
        </Button>
        <span className="ppm:text-lg ppm:font-semibold ppm:text-gray-900">Post</span>
        <Button
          variant="ghost"
          size="sm"
          className="ppm:p-2"
        >
          <DotsThree className="ppm:w-5 ppm:h-5" />
        </Button>
      </div>
    );
    return () => setAppBarContent(null);
  }, [setAppBarContent, navigate]);

  const handleLike = async () => {
    if (!authUser || !postId) return;

    try {
      if (isLiked) {
        await likeRepository.unlike(authUser.uid, postId, 'post');
        setIsLiked(false);
        setPost(prev => prev ? { ...prev, likeCount: Math.max(0, prev.likeCount - 1) } : null);
      } else {
        await likeRepository.like(authUser.uid, postId, 'post');
        setIsLiked(true);
        setPost(prev => prev ? { ...prev, likeCount: prev.likeCount + 1 } : null);
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir:', error);
    }
  };


  const handleSubmitComment = async () => {
    if (!authUser || !postId || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await commentRepository.createComment({
        postId,
        userId: authUser.uid,
        text: newComment.trim()
      });

      // Recarregar comentários
      const updatedComments = await commentRepository.getCommentsByPostWithUser(postId, 50);
      setComments(updatedComments);

      // Atualizar contador de comentários no post
      setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);

      setNewComment("");
    } catch (error) {
      console.error('Erro ao comentar:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (date: Date | any) => {
    // Garantir que temos um objeto Date válido
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (date && typeof date.toDate === 'function') {
      // Firestore Timestamp
      dateObj = date.toDate();
    } else if (date && typeof date.seconds === 'number') {
      // Firestore Timestamp como objeto
      dateObj = new Date(date.seconds * 1000);
    } else if (typeof date === 'string' || typeof date === 'number') {
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="ppm:flex ppm:items-center ppm:justify-center ppm:h-full">
        <div className="ppm:animate-spin ppm:rounded-full ppm:h-8 ppm:w-8 ppm:border-b-2 ppm:border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="ppm:p-4 ppm:text-center">
        <p className="ppm:text-gray-600">Post não encontrado</p>
      </div>
    );
  }

  return (
    <div className="ppm:flex ppm:flex-col ppm:bg-white">
      {/* Imagem do Post */}
      <div className="ppm:relative ppm:w-full ppm:aspect-square ppm:bg-gray-100">
        <img
          src={post.imageUrl}
          alt="Post"
          className="ppm:w-full ppm:h-full ppm:object-cover"
        />
      </div>

      {/* Conteúdo do Post */}
      <div className="ppm:flex-1 ppm:flex ppm:flex-col">
        {/* Header do Post */}
        <div className="ppm:flex ppm:items-center ppm:justify-between ppm:p-2 ppm:border-b ppm:border-gray-100">
          <div className="ppm:flex ppm:items-center ppm:gap-3">
            <Avatar className="ppm:w-8 ppm:h-8">
              <AvatarImage src={post.user?.avatarUrl} alt={post.user?.displayName || ''} />
              <AvatarFallback className="ppm:text-xs">
                {getInitials(post.user?.displayName || '')}
              </AvatarFallback>
            </Avatar>
            <div className="ppm:flex ppm:flex-col">
              <span className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
                {post.user?.displayName}
              </span>
              <span className="ppm:text-xs ppm:text-gray-500">
                {post.location && (
                  <span className="ppm:flex ppm:items-center ppm:gap-1">
                    <MapPin className="ppm:w-3 ppm:h-3" />
                    {post.location}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Ações do Post */}
        <div className="ppm:flex ppm:items-center ppm:justify-between ppm:p-2 ppm:border-b ppm:border-gray-100">
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
          </div>
        </div>

        {/* Likes */}
        {post.likeCount > 0 && (
          <div className="ppm:px-4 ppm:py-2 ppm:border-b ppm:border-gray-100">
            <span className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
              {post.likeCount} curtida{post.likeCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="ppm:px-4 ppm:py-2 ppm:border-b ppm:border-gray-100">
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
          <div className="ppm:px-4 ppm:py-2 ppm:border-b ppm:border-gray-100">
            <div className="ppm:flex ppm:flex-wrap ppm:gap-1">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="ppm:text-xs ppm:cursor-pointer ppm:hover:bg-blue-100"
                  onClick={() => navigate(`/profile/${tag}`)}
                >
                  @{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Comentários */}
        <div className="ppm:flex-1 ppm:px-4 ppm:py-2">
          {loadingComments ? (
            <div className="ppm:flex ppm:items-center ppm:justify-center ppm:py-8">
              <div className="ppm:animate-spin ppm:rounded-full ppm:h-6 ppm:w-6 ppm:border-b-2 ppm:border-blue-600"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="ppm:space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="ppm:flex ppm:gap-3">
                  <Avatar className="ppm:w-6 ppm:h-6 ppm:flex-shrink-0">
                    <AvatarImage src={comment.user?.avatarUrl} alt={comment.user?.displayName || ''} />
                    <AvatarFallback className="ppm:text-xs">
                      {getInitials(comment.user?.displayName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ppm:flex-1 ppm:min-w-0">
                    <div className="ppm:flex ppm:gap-2 ppm:items-start">
                      <span className="ppm:text-sm ppm:font-semibold ppm:text-gray-900">
                        {comment.user?.username}
                      </span>
                      <span className="ppm:text-sm ppm:text-gray-900 ppm:flex-1">
                        {comment.text}
                      </span>
                    </div>
                    <div className="ppm:flex ppm:items-center ppm:gap-4 ppm:mt-1">
                      <span className="ppm:text-xs ppm:text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.likeCount > 0 && (
                        <span className="ppm:text-xs ppm:text-gray-500">
                          {comment.likeCount} curtida{comment.likeCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ppm:text-center ppm:py-8 ppm:text-gray-500 ppm:text-sm">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </div>
          )}
        </div>

        {/* Data do Post */}
        <div className="ppm:px-4 ppm:py-2 ppm:border-t ppm:border-gray-100">
          <div className="ppm:flex ppm:items-center ppm:gap-1 ppm:text-xs ppm:text-gray-500">
            <Clock className="ppm:w-3 ppm:h-3" />
            {formatDate(post.createdAt)}
          </div>
        </div>

        {/* Input de Comentário */}
        <div className="ppm:flex ppm:items-center ppm:gap-2 ppm:p-2 ppm:border-t ppm:border-gray-100">
          <Input
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="ppm:flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !submittingComment) {
                handleSubmitComment();
              }
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submittingComment}
            className="ppm:text-blue-600 ppm:font-semibold"
          >
            {submittingComment ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </div>
    </div>
  );
} 
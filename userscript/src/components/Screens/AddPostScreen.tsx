import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppBar } from "@/components/ui/AppBarContext";
import { usePostForm } from "@/hooks/usePostForm";
import { MentionInput } from "@/components/ui/MentionInput";
import { ArrowLeft, Image, MapPin, Globe, Lock, Camera, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AddPostScreen() {
  const { setAppBarContent } = useAppBar();
  const navigate = useNavigate();
  const {
    imageUrl,
    setImageUrl,
    caption,
    setCaption,
    location,
    setLocation,
    isPublic,
    setIsPublic,
    mentions,
    loading,
    imageError,
    setImageError,
    searchMentions,
    addMention,
    removeMention,
    submitPost
  } = usePostForm();

  const [imageLoading, setImageLoading] = useState(false);

  // Configurar AppBar
  useEffect(() => {
    setAppBarContent(
      <div className="ppm:flex ppm:items-center ppm:justify-between ppm:w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="ppm:p-2"
        >
          <ArrowLeft className="ppm:w-5 ppm:h-5" />
        </Button>
        <span className="ppm:text-lg ppm:font-semibold ppm:text-gray-900">Novo Post</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSubmit}
          disabled={loading || !imageUrl.trim() || !caption.trim()}
          className="ppm:text-blue-600 ppm:hover:text-blue-700 ppm:font-medium"
        >
          {loading ? "Postando..." : "Compartilhar"}
        </Button>
      </div>
    );
    return () => setAppBarContent(null);
  }, [setAppBarContent, navigate, loading, imageUrl, caption]);

  // Validar e carregar imagem
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setImageError(false);
    
    if (url.trim()) {
      setImageLoading(true);
      const img = new window.Image();
      img.onload = () => {
        setImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        setImageLoading(false);
        setImageError(true);
      };
      img.src = url;
    }
  };

  const handleSubmit = async () => {
    try {
      await submitPost();
    } catch (error) {
      console.error('Erro ao criar post:', error);
      // Aqui você pode adicionar um toast de erro
    }
  };

  return (
    <div className="ppm:p-4 ppm:space-y-6">
      {/* Seção da Imagem */}
      <Card>
        <CardContent className="ppm:p-4">
          <div className="ppm:space-y-4">
            {/* Input da URL da imagem */}
            <div className="ppm:space-y-2">
              <Label htmlFor="imageUrl" className="ppm:flex ppm:items-center ppm:gap-2">
                <Image className="ppm:w-4 ppm:h-4" />
                URL da Imagem
              </Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="Cole a URL da sua imagem aqui..."
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="ppm:w-full"
              />
            </div>

            {/* Preview da imagem */}
            <div className="ppm:space-y-2">
              <Label className="ppm:text-sm ppm:font-medium ppm:text-gray-700">
                Preview da Imagem
              </Label>
              
              {/* Container com proporção 1:1 */}
              <div className="ppm:relative ppm:w-full ppm:aspect-square ppm:bg-gray-100 ppm:rounded-lg ppm:overflow-hidden ppm:border-2 ppm:border-dashed ppm:border-gray-300">
                {imageUrl.trim() ? (
                  <>
                    {imageLoading && (
                      <div className="ppm:absolute ppm:inset-0 ppm:flex ppm:items-center ppm:justify-center ppm:bg-gray-100">
                        <div className="ppm:animate-spin ppm:rounded-full ppm:h-8 ppm:w-8 ppm:border-b-2 ppm:border-blue-600"></div>
                      </div>
                    )}
                    
                    {imageError && (
                      <div className="ppm:absolute ppm:inset-0 ppm:flex ppm:flex-col ppm:items-center ppm:justify-center ppm:bg-red-50 ppm:text-red-600">
                        <AlertCircle className="ppm:w-8 ppm:h-8 ppm:mb-2" />
                        <span className="ppm:text-sm ppm:font-medium">Erro ao carregar imagem</span>
                      </div>
                    )}
                    
                    {!imageLoading && !imageError && (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="ppm:w-full ppm:h-full ppm:object-cover"
                        onError={() => setImageError(true)}
                      />
                    )}
                  </>
                ) : (
                  <div className="ppm:absolute ppm:inset-0 ppm:flex ppm:flex-col ppm:items-center ppm:justify-center ppm:text-gray-400">
                    <Camera className="ppm:w-12 ppm:h-12 ppm:mb-2" />
                    <span className="ppm:text-sm ppm:font-medium">Proporção recomendada: 1:1</span>
                    <span className="ppm:text-xs">Cole uma URL de imagem para ver o preview</span>
                  </div>
                )}
              </div>

              {/* Informações sobre proporção */}
              <div className="ppm:text-xs ppm:text-gray-500 ppm:bg-blue-50 ppm:p-3 ppm:rounded-md">
                <div className="ppm:font-medium ppm:text-blue-800 ppm:mb-1">
                  💡 Dica de Proporção
                </div>
                <p>
                  Para melhor visualização, use imagens com proporção 1:1 (quadrada). 
                  Imagens com outras proporções serão cortadas para se ajustar ao formato quadrado.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Conteúdo */}
      <Card>
        <CardContent className="ppm:p-4">
          <div className="ppm:space-y-4">
            {/* Caption com mentions */}
            <div className="ppm:space-y-2">
              <Label htmlFor="caption" className="ppm:font-medium ppm:text-gray-700">
                Descrição
              </Label>
              <MentionInput
                value={caption}
                onChange={setCaption}
                placeholder="Escreva uma descrição para sua publicação..."
                mentions={mentions}
                onAddMention={addMention}
                onRemoveMention={removeMention}
                searchMentions={searchMentions}
              />
            </div>

            {/* Localização */}
            <div className="ppm:space-y-2">
              <Label htmlFor="location" className="ppm:flex ppm:items-center ppm:gap-2">
                <MapPin className="ppm:w-4 ppm:h-4" />
                Localização
              </Label>
              <Input
                id="location"
                placeholder="Adicionar localização..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="ppm:w-full"
              />
            </div>

            {/* Configurações de privacidade */}
            <div className="ppm:space-y-2">
              <Label className="ppm:font-medium ppm:text-gray-700">
                Privacidade
              </Label>
              <div className="ppm:flex ppm:items-center ppm:space-x-4">
                <label className="ppm:flex ppm:items-center ppm:space-x-2 ppm:cursor-pointer">
                  <input
                    type="radio"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="ppm:form-radio ppm:text-blue-600"
                  />
                  <Globe className="ppm:w-4 ppm:h-4 ppm:text-gray-600" />
                  <span className="ppm:text-sm ppm:text-gray-700">Público</span>
                </label>
                <label className="ppm:flex ppm:items-center ppm:space-x-2 ppm:cursor-pointer">
                  <input
                    type="radio"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="ppm:form-radio ppm:text-blue-600"
                  />
                  <Lock className="ppm:w-4 ppm:h-4 ppm:text-gray-600" />
                  <span className="ppm:text-sm ppm:text-gray-700">Privado</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
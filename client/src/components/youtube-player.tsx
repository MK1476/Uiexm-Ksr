interface YouTubePlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function YouTubePlayer({ url, title = "Product Video", className = "" }: YouTubePlayerProps) {
  // Extract video ID from various YouTube URL formats including Shorts
  const getVideoId = (url: string): string | null => {
    // Regular YouTube video URL patterns
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[7] && match[7].length === 11) {
      return match[7];
    }
    
    // YouTube Shorts URL pattern
    const shortsRegExp = /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
    const shortsMatch = url.match(shortsRegExp);
    
    if (shortsMatch && shortsMatch[1]) {
      return shortsMatch[1];
    }
    
    return null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return null;
  }

  // Check if it's a Shorts URL
  const isShorts = url.includes('/shorts/');
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`relative ${className}`}>
      <div className={isShorts ? "aspect-[9/16] max-w-sm mx-auto" : "aspect-video"}>
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
      {isShorts && (
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            YouTube Shorts
          </span>
        </div>
      )}
    </div>
  );
}